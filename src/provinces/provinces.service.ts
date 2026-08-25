import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NotFound } from '../common/errors/throw';
import DATABASE_CONNECTION from '../database/database-connection';
import { provinces } from '../database/database.schemas';
import type Database from '../database/interfaces/database.interface';

@Injectable()
export class ProvincesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureProvinceExists(provinceId: number) {
    const province = await this.db.query.provinces.findFirst({
      columns: {
        provinceId: true,
      },
      where: eq(provinces.provinceId, provinceId),
    });

    if (!province) {
      throw NotFound('province');
    }
  }

  async getProvinces() {
    return this.db.query.provinces.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
    });
  }
}
