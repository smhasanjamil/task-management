import jwt from 'jsonwebtoken';
import { IJwtPayload } from './auth.interface';

export class JwtUtils {
  /**
   * Creates a JWT token
   */
  static createToken(
    payload: IJwtPayload,
    secret: jwt.Secret,
    expiresIn: jwt.SignOptions['expiresIn']
  ): string {
    if (!secret) throw new Error('JWT secret is required');
    
    return jwt.sign(payload, secret, { expiresIn });
  }

  /**
   * Verifies a JWT token
   */
  static verifyToken(token: string, secret: jwt.Secret): IJwtPayload {
    if (!token) throw new Error('Token is required');
    if (!secret) throw new Error('JWT secret is required');

    try {
      return jwt.verify(token, secret) as IJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decodes a JWT token without verification
   */
  static decodeToken(token: string): IJwtPayload | null {
    try {
      return jwt.decode(token) as IJwtPayload;
    } catch {
      return null;
    }
  }
}