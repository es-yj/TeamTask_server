import {
  Controller,
  Get,
  UseGuards,
  Request,
  Response,
  Post,
  Patch,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './strategy/google-oauth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateTeamInfoDto } from './dto/update-team-info.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/get-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {}

  @ApiOperation({ summary: '구글 로그인 요청' })
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Response() res) {
    const { user, url } = await this.authService.findOrSaveUser(req);
    const { accessToken, refreshToken } = this.authService.getToken(user);
    res.cookie('access-token', accessToken, { httpOnly: true });
    res.cookie('refresh-token', refreshToken, { httpOnly: true });

    res.redirect(url);
  }

  @UseGuards(AuthGuard('access'))
  @Patch('team')
  async updateTeamInfo(
    @Body() updateTeamInfoDto: UpdateTeamInfoDto,
    @GetUser() userId: number,
  ) {
    return this.authService.updateTeamInfo(userId, updateTeamInfoDto);
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
