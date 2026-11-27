import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: SignInDto): Promise<SignInResponseDto> {
    const authData = await this.authService.signIn(body.email, body.password);

    return plainToInstance(SignInResponseDto, authData);
  }

  @Put('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @CurrentUser('email') email: string,
  ) {
    await this.authService.resetPassword(
      email,
      body.oldPassword,
      body.newPassword,
    );
  }
}
