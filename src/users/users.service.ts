import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

// export type User = {
//   id: string;
//   name: string;
//   username: string;
//   password: string;
//   email: string;
// };

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}
  async getUserById(id: string) {
    return this.userModel.findOne({ _id: id }).lean();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ username }).lean();
  }

  async createUser(user: User) {
    try {
      const newUser = new this.userModel({ ...user });
      const result = await newUser.save();
      return result.id;
    } catch (error) {
      throw new BadRequestException('User data invalid');
    }
  }

  async updateUser(username: string, data: any) {
    try {
      await this.userModel.updateOne({ username }, { $set: { ...data } });
    } catch (error) {
      throw new BadRequestException('Update failed');
    }
  }
}
