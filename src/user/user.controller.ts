import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { UserService } from './user.service';
import { UpdateUserDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { RoleTransformPipe } from './pipes/role-transform.pipe';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from './enum/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { StatusTransformPipe } from './pipes/status-transform.pipe';

@ApiTags('User')
@ApiBearerAuth('accessToken')
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

  @ApiOperation({
    summary: '승인 대기 유저 조회',
    description: '권한: 팀장/실장',
  })
  @Roles(Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
  @Get('pending')
  async getPendingUsers(
    @GetUser()
    userId: number,
  ) {
    return this.userService.findPendingUsers(userId);
  }

  @ApiOperation({
    summary: '유저 정보 수정',
    description: '권한: 팀장/실장/관리자 | 상태값: [PA,PM,팀장,실장,관리자]',
  })
  @ApiForbiddenResponse({ description: '수정 권한이 없음' })
  @ApiParam({ name: 'id', required: true, description: 'user id' })
  @Roles(Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateUser(
    @Body(new RoleTransformPipe()) updateUserDto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({
    summary: '유저 승인',
    description: '권한: 팀장/실장/관리자 | 상태값: [승인, 거절]',
  })
  @ApiForbiddenResponse({ description: '승인 권한이 없음' })
  @ApiParam({ name: 'id', required: true, description: 'user id' })
  @Roles(Role.TM, Role.VM, Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  async updateUserStatus(
    @GetUser() userId: number,
    @Param('id') id: number,
    @Body(new StatusTransformPipe()) updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return await this.userService.updateUserStatus(
      id,
      updateUserStatusDto,
      userId,
    );
  }
}
