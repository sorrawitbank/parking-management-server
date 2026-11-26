import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Injectable()
export class SupabaseAuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(email: string, password: string) {
    const supabase = this.supabaseService.getAuthClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async getUser(accessToken: string) {
    const supabase = this.supabaseService.getAuthClient();

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      throw error;
    }

    return data.user;
  }
}
