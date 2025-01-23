import {bind, BindingScope} from '@loopback/core';
import {PrismaClient} from '@prisma/client';
import {hashToken} from '../utils/hash.utils';
import {generateRefreshToken, generateTokens} from '../utils/jwt.utils';
import bcrypt from 'bcrypt';
import {HttpErrors} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '../keys';
import {securityId} from '@loopback/security';


@bind({scope: BindingScope.TRANSIENT})
export class AuthService {
  prisma: PrismaClient;

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private jwtService: TokenService,
  ) {
    this.prisma = new PrismaClient();
  }

  async register(email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {email},
    });

    if (existingUser) {
      throw new HttpErrors.BadRequest('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const {accessToken, refreshToken} = generateTokens(user);
    await this.addRefreshTokenToWhitelist(refreshToken, user.id);

    return {accessToken, refreshToken};
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: {email},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new HttpErrors.Unauthorized('Invalid credentials');
    }

    const userProfile = {
      [securityId]: user.id,
      userId: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.generateToken(userProfile);
    const refreshToken = generateRefreshToken();
    await this.addRefreshTokenToWhitelist(refreshToken, user.id);

    return {accessToken, refreshToken};
  }

  private async addRefreshTokenToWhitelist(refreshToken: string, userId: string) {
    return this.prisma.refreshToken.create({
      data: {
        hashedToken: hashToken(refreshToken),
        userId,
        expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
  }

  async refreshToken(token: string) {
    const savedToken = await this.prisma.refreshToken.findUnique({
      where: {hashedToken: hashToken(token)},
    });

    if (!savedToken || savedToken.revoked || Date.now() >= savedToken.expireAt.getTime()) {
      throw new HttpErrors.Unauthorized('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: {id: savedToken.userId},
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('User not found');
    }

    await this.prisma.refreshToken.update({
      where: {id: savedToken.id},
      data: {revoked: true},
    });

    const {accessToken, refreshToken} = generateTokens(user);
    await this.addRefreshTokenToWhitelist(refreshToken, user.id);

    return {accessToken, refreshToken};
  }
} 