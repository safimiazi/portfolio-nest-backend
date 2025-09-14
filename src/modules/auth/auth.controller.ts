import { Controller, Post, Body, Get, Redirect, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { successResponse } from 'src/common/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const result = await this.authService.register(dto);
    return successResponse(result, 'Registration successful');
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    const result = await this.authService.login(dto);
    return successResponse(result, 'Login successful');
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    const result = await this.authService.forgotPassword(email);
    return successResponse(result, 'OTP sent successfully');
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: { email: string; otp: string; newPassword: string },
  ) {
    const result = await this.authService.resetPasswordWithOtp(body.email, body.otp, body.newPassword);
    return successResponse(result, 'Password reset successful');
  }
}
