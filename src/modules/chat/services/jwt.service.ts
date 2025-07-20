import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  public generateJwt(user: any): string {
    const payload = { sub: user._id, username: user.userName };
    return jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '7d',
    });
  }
}
