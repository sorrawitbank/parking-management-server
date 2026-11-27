import { Inject, Injectable } from '@nestjs/common';
import { NotFound } from '../../common/errors';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import { type Database } from '../../database/interfaces';

@Injectable()
export class UsersService {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  async getUserById(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: {
        userId: { eq: userId },
      },
    });

    if (!user) {
      throw NotFound('user');
    }

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.db.query.users.findFirst({
      where: {
        email: { eq: email },
      },
    });

    if (!user) {
      throw NotFound('user');
    }

    return user;
  }
}
