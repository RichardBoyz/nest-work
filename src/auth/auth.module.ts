import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { RtStrategy } from './rt.strategy';
import { SessionSerializer } from './session.serializer';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: 'SECRET', signOptions: { expiresIn: '60s' } }), // Put "sercret" to env variables
  ], // use session:PassportModule.register({ session: true }
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ], // use session:SessionSerializer
  exports: [AuthService],
})
export class AuthModule {}
