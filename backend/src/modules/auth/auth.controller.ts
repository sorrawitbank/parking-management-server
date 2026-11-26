import { Body, Controller, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() body: SignInDto): Promise<SignInResponseDto> {
    const authData = await this.authService.signIn(body.email, body.password);

    return plainToInstance(SignInResponseDto, authData);
  }
}
