import {
  Controller,
  Get,
  UseGuards,
  Request,
  Response,
  Post,
  Patch,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './strategy/google-oauth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTeamInfoDto } from './dto/update-team-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/get-user.decorator';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '구글 로그인 요청' })
  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user, url } = await this.authService.findOrSaveUser(req);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    res.redirect(url + accessToken);
  }

  @ApiOperation({ summary: '팀 정보 입력' })
  @UseGuards(AuthGuard('access'))
  @Patch('team')
  async updateTeamInfo(
    @Body() updateTeamInfoDto: UpdateTeamInfoDto,
    @GetUser() userId: number,
  ) {
    return this.authService.updateTeamInfo(userId, updateTeamInfoDto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('refresh'))
  async logout(@Req() req, @Res() res): Promise<any> {
    await this.userService.removeRefreshToken(req.user.id);
    res.clearCookie('refreshToken');

    return {
      message: 'logout success',
    };
  }

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  @ApiOperation({ description: '액세스 토큰 재발급' })
  async restoreAccessToken(@Request() req) {
    const accessToken = await this.authService.generateAccessToken(req.user);
    return { accessToken };
  }
}
