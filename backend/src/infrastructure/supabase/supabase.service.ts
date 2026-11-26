import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_AUTH_CLIENT } from './supabase.constants';

@Injectable()
export class SupabaseService {
  constructor(
    @Inject(SUPABASE_AUTH_CLIENT) private readonly authClient: SupabaseClient,
  ) {}

  getAuthClient() {
    return this.authClient;
  }
}
