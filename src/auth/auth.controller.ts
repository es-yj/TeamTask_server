import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './strategy/google-oauth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  async googleAuthRedirect(@Request() req) {
    return await this.authService.googleLogin(req);
  }
}
