import { Global, Module } from '@nestjs/common';
import { SupabaseAuthService } from './auth/supabase-auth.service';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  providers: [SupabaseService, SupabaseAuthService],
  exports: [SupabaseAuthService],
})
export class SupabaseModule {}
