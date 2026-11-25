import { Inject, Injectable } from '@nestjs/common';
import { NotFound } from '../../common/errors/throw';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import { type Database } from '../../database/interfaces';

@Injectable()
export class ProvincesService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async ensureProvinceExists(provinceId: number) {
    const province = await this.db.query.provinces.findFirst({
      columns: {
        provinceId: true,
      },
      where: {
        provinceId: { eq: provinceId },
      },
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
