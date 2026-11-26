import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseAuthService } from './auth/supabase-auth.service';
import { SUPABASE_AUTH_CLIENT } from './supabase.constants';
import { SupabaseService } from './supabase.service';

@Module({
  providers: [
    {
      provide: SUPABASE_AUTH_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createClient(
          configService.getOrThrow('SUPABASE_URL'),
          configService.getOrThrow('SUPABASE_PUBLISHABLE_KEY'),
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
              detectSessionInUrl: false,
            },
          },
        ),
    },
    SupabaseService,
    SupabaseAuthService,
  ],
  exports: [SupabaseAuthService],
})
export class SupabaseModule {}
