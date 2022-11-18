import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async addUser(@Body('user') user: User) {
    return this.usersService.createUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async editUser(@Body() request: any) {
    console.log(request);
  }
}
