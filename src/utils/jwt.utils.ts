import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function generateAccessToken(user: any) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: '5m',
  });
}

export function generateRefreshToken() {
  return crypto.randomBytes(16).toString('base64url');
}

export function generateTokens(user: any) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
} 