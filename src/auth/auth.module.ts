import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RtStrategy } from './rt.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: 'SECRET', signOptions: { expiresIn: '60s' } }), // Put "sercret" to env variables
  ], // use session:PassportModule.register({ session: true }
  providers: [AuthService, LocalStrategy, JwtStrategy, RtStrategy], // use session:SessionSerializer
  exports: [AuthService],
})
export class AuthModule {}
