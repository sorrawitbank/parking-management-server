import { Expose } from 'class-transformer';
import { PaginationMetaDto } from './pagination-meta.dto';

export class PaginationResponseDto<T> {
  @Expose()
  data: T[];

  @Expose()
  pagination: PaginationMetaDto;
}
