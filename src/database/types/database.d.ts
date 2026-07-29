import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as relations from '../database.relations';
import * as schemas from '../database.schemas';

const schema = {
  ...relations,
  ...schemas,
};

type Database = NodePgDatabase<typeof schema>;

export default Database;
