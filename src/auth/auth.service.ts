import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
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

  extractUserPublicData(data: any) {
    const {
      createdAt,
      updatedAt,
      password,
      refreshToken,
      __v,
      _id,
      id,
      ...rest
    } = data;
    delete rest._id;
    rest.id = id ?? _id;
    return rest;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user && user.password === password) {
      const userInfo = this.extractUserPublicData(user);
      return userInfo;
    }

    return null;
  }

  async signup(user: User) {
    try {
      const hash = this.hashData(user.password);

      const newUser = await this.usersService.createUser(user);

      const tokens = await this.getTokens(this.extractUserPublicData(newUser));

      await this.updateRtHash(user.username, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new BadRequestException('Data invalid');
    }
  }

  async login(user: any) {
    const payload = {
      fullName: user.fullName,
      username: user.username,
      id: user.id,
    };
    const userInfo = this.extractUserPublicData(user);
    const refreshToken = await this.jwtService.signAsync(
      {
        ...userInfo,
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
      ...userInfo,
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

  async getTokens(userInfo: User) {
    const accessToken = await this.jwtService.signAsync(
      {
        ...userInfo,
      },
      {
        secret: 'SECRET',
        expiresIn: 60,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      {
        ...userInfo,
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
    if (!user.refreshToken) throw new ForbiddenException('抓到你囉1');
    const isMatchRefreshToken = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isMatchRefreshToken) throw new ForbiddenException('抓到你囉');

    const userInfo = this.extractUserPublicData(user);
    const tokens = await this.getTokens(userInfo);

    await this.updateRtHash(user.username, tokens.refreshToken);

    return { ...tokens, ...userInfo };
  }
}

// fffff
