import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

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
    return {
      id: payload.id,
      username: payload.username,
      name: payload.name,
    };
    // this return is req.user
  }
}
