import { Body, Controller, Post } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { Group } from './groups.model';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupService: GroupsService) {}

  @Post()
  async createGroup(@Body('group') group: Group) {
    const groupId = await this.groupService.create(group);
    return groupId;
  }
}
