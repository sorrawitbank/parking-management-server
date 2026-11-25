import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  private get nodeEnv(): string {
    return this.configService.get('NODE_ENV', 'development');
  }

  get isProd(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDev(): boolean {
    return this.nodeEnv === 'development';
  }
}
