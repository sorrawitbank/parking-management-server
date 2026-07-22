import { Transform } from 'class-transformer';
import {
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateTenantDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(2, 100)
  readonly name: string;

  @IsPhoneNumber('TH')
  @IsNumberString()
  @IsOptional()
  readonly phone?: string | null;

  @Matches(/^[a-z0-9._-]{4,20}$/, {
    message:
      'lineId must be between 4 and 20 characters and can only contain lowercase letters, numbers, dots, underscores, and hyphens',
  })
  @IsOptional()
  readonly lineId?: string | null;

  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Length(1, 500)
  @IsOptional()
  readonly note?: string | null;
}
