import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { JwtRefreshGuard } from './auth/jwt-refresh.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { User } from './users/user.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @UseGuards(AuthenticatedGuard)
  @UseGuards(JwtAuthGuard)
  @Get('/test')
  getTest(@Request() req): string {
    return req.user;
  }

  @Post('signup')
  signup(@Body() user: User): any {
    return this.authService.signup(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    // return { message: '登入成功!' };
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Response() res) {
    const isLogouted = await this.authService.logout(req.user.username);
    if (isLogouted) {
      res.send({ message: 'success' });
    }
    throw new BadRequestException('登出失敗');

    // console.log(req.user);
    // return req.logout((err) => {
    //   if (err) throw new BadRequestException('登出失敗ㄏㄏ');
    //   res.send({ message: 'ㄅㄅ', req });
    // });
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }
}
