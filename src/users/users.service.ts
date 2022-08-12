import { Injectable } from '@nestjs/common';

export type User = {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '1',
      name: 'rich',
      username: 'richard',
      password: '223',
      email: 't@t.com',
    },
    {
      id: '2',
      name: 'bi',
      username: 'bill',
      password: '133',
      email: 'f@t.com',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
