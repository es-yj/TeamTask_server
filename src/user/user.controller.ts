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
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@UseGuards(AuthGuard())
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '유저 정보 수정' })
  @Patch()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() userId: number,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @ApiOperation({ summary: '유저가 속한 프로젝트 조회' })
  @Get('project')
  async getProjectDetail(
    @GetUser()
    userId: number,
  ) {
    return this.userService.findProjectsByUserId(userId);
  }
}
