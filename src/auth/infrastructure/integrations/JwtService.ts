import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

  static generateToken(payload: object): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: '1h' });
  }

  static verifyToken(token: string): JwtPayload | string | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as JwtPayload | string;
    } catch (error) {
      return null;
    }
  }
}
