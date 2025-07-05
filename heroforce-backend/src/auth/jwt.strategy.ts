import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'meu-super-poder',
    });
  }

  async validate(payload: any): Promise<User> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      isAdmin: payload.isAdmin,
    } as User;
  }
}