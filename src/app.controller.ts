import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/test')
  getTest(@Request() req): string {
    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req): any {
    return { message: '登入成功!' };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Request() req, @Response() res): string {
    return req.logout((err) => {
      if (err) throw new BadRequestException('登出失敗ㄏㄏ');
      res.send({ message: 'ㄅㄅ' });
    });
  }
}
