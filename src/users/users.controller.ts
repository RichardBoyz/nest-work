import { Body, Controller, Post } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async addUser(@Body('user') user: User) {
    return this.usersService.createUser(user);
  }
}
