import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import DATABASE_CONNECTION from '../database/database-connection';
import { provinces } from '../database/database.schemas';
import type Database from '../database/types/database';

@Injectable()
export class ProvincesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getProvinces() {
    return this.db.query.provinces.findMany();
  }

  async getProvinceById(provinceId: number) {
    const province = await this.db.query.provinces.findFirst({
      where: eq(provinces.provinceId, provinceId),
    });

    if (!province) {
      throw new NotFoundException('Province Not Found');
    }

    return province;
  }
}
