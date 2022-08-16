import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async signup(user: User) {
    const hash = this.hashData(user.password);

    const newUser = await this.usersService.createUser(user);

    const tokens = await this.getTokens(user.username, user.name, newUser);

    await this.updateRtHash(user.username, tokens.refreshToken);
    return tokens;
  }

  async login(user: any) {
    const payload = { name: user.name, username: user.username, id: user._id };
    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
      },
      {
        secret: 'RT-SECRET',
        expiresIn: 60 * 60 * 24 * 7,
      },
    );
    const hashRefreshToken = await this.hashData(refreshToken);
    await this.usersService.updateUser(user.username, {
      refreshToken: hashRefreshToken,
    });

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
      id: user._id,
      name: user.name,
      username: user.username,
    };
  }

  async logout(username: string) {
    try {
      await this.usersService.updateUser(username, { refreshToken: null });
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateRtHash(username: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.usersService.updateUser(username, { refreshToken: hash });
  }

  async getTokens(username: string, name: string, id: string) {
    const accessToken = await this.jwtService.signAsync(
      {
        id,
        name,
        username,
      },
      {
        secret: 'SECRET',
        expiresIn: 60,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        id,
        name,
        username,
      },
      {
        secret: 'RT-SECRET',
        expiresIn: 60 * 60 * 24 * 7,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) throw new ForbiddenException('你是誰');
    if (!user.refreshToken) throw new ForbiddenException('抓到你囉');
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isMatchRefreshToken) throw new ForbiddenException('抓到你囉');

    const tokens = await this.getTokens(user.username, user.name, userId);
    await this.updateRtHash(user.username, tokens.refreshToken);
    return tokens;
  }
}
