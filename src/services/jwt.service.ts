import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {TokenService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {promisify} from 'util';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const signAsync = promisify<object, string, jwt.SignOptions, string>(jwt.sign);
const verifyAsync = promisify<string, string, any>(jwt.verify);

export class JWTService implements TokenService {
  constructor() {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        'Error verifying token: token is null',
      );
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      throw new HttpErrors.InternalServerError('JWT_ACCESS_SECRET is not defined');
    }

    try {
      const decodedToken = await verifyAsync(token, process.env.JWT_ACCESS_SECRET) as unknown as {userId: string; email: string};
      const userProfile = Object.assign(
        {[securityId]: decodedToken.userId},
        {
          userId: decodedToken.userId,
          email: decodedToken.email,
        },
      );

      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token: ${error.message}`,
      );
    }
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error generating token: userProfile is null',
      );
    }
    if (!process.env.JWT_ACCESS_SECRET) {
      throw new HttpErrors.InternalServerError('JWT_ACCESS_SECRET is not defined');
    }
    const userInfoForToken = {
      userId: userProfile[securityId],
      email: userProfile.email,
    };
    
    return signAsync(userInfoForToken, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '1h',
    });
  }
}