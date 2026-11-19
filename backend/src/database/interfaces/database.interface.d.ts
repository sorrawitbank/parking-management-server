import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { relations } from '../database.relations';

type Database = NodePgDatabase<typeof relations>;
