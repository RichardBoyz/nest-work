import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // ignoreExpiration: true,
      secretOrKey: 'SECRET', // Move to env variable
    });
  }

  async validate(payload: any) {
    // use userservice to get user by id (subload.sub)
    // const user=await this.usersService.findOne()
    const { exp, iat, ...restPayload } = payload;
    return {
      ...restPayload,
    };
    // this return is req.user
  }
}
