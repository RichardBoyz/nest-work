import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './groups.model';
@Injectable()
export class GroupsService {
  constructor(
    @InjectModel('Group') private readonly groupModel: Model<Group>,
  ) {}

  async create(group: Group) {
    const newGroup = new this.groupModel(group);
    const result = await newGroup.save();
    return result.id;
  }
}
