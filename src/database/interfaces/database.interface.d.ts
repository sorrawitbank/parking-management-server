import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from '../database.relations';

declare type Database = NodePgDatabase<typeof relations>;

export default Database;
