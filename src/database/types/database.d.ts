import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schemas from '../database.schemas';

type Database = NodePgDatabase<typeof schemas>;

export default Database;
