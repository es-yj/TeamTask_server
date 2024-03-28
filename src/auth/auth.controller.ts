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
    const { accessToken, refreshToken } = this.authService.getToken(user);
    // res.cookie('access-token', accessToken, { httpOnly: true });
    res.cookie('refresh-token', refreshToken, { httpOnly: true });

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
  async logout(@Request() req: any, @Res() res: Response): Promise<any> {
    await this.userService.removeRefreshToken(req.user.sub);
    // res.clearCookie('access_token');
    // res.clearCookie('refresh_token');
    return {
      message: 'logout success',
    };
  }
  // @UseGuards(AuthGuard('refresh'))
  // @Post('/refresh')
  // @ApiOperation({ description: '토큰 재발급' })
  // restoreAccessToken(@Request() req) {
  //   const accessToken = await this.authService.getAccessToken({
  //     user: req.user,
  //   });
  // }
}
