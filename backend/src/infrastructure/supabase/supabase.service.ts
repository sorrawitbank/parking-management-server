import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  constructor(private readonly configService: ConfigService) {}

  createAuthClient() {
    return createClient(
      this.configService.getOrThrow('SUPABASE_URL'),
      this.configService.getOrThrow('SUPABASE_PUBLISHABLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    );
  }
}
