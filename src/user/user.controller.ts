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
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/get-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('User')
@UseGuards(AuthGuard('access'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인한 유저의 프로필 반환' })
  @Get('profile')
  async getUserProfile(@GetUser() userId: number) {
    return this.userService.findUserById(userId);
  }

  @ApiOperation({ summary: '유저 목록 반환(팀별 필터 가능)' })
  @ApiQuery({ name: 'teamId', required: false, description: 'team id' })
  @Get()
  async getUsersByTeam(@Query('teamId') teamId?: number) {
    return this.userService.getUsersByTeam(teamId);
  }

  @ApiOperation({ summary: '유저가 속한 프로젝트 조회' })
  @Get('project')
  async getProjectDetail(
    @GetUser()
    userId: number,
  ) {
    return this.userService.findProjectsByUserId(userId);
  }

  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiParam({ name: 'id', required: true, description: 'user id' })
  @Patch(':id')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}
