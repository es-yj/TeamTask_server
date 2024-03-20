import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/get-user.decorator';
import { UserService } from './user.service';

@ApiTags('User')
@UseGuards(AuthGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저가 속한 프로젝트 조회' })
  @Get('project')
  async getProjectDetail(
    @GetUser()
    userId: number,
  ) {
    return this.userService.findProjectsByUserId(userId);
  }
}
