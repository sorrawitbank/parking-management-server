import { Database } from './database.interface';

type FindFirstConfig<T extends keyof Database['query']> = NonNullable<
  Parameters<Database['query'][T]['findFirst']>[0]
>;

type FindFirstWhere<T extends keyof Database['query']> = NonNullable<
  FindFirstConfig<T>['where']
>;

type FindManyConfig<T extends keyof Database['query']> = NonNullable<
  Parameters<Database['query'][T]['findMany']>[0]
>;

type FindManyWhere<T extends keyof Database['query']> = NonNullable<
  FindManyConfig<T>['where']
>;
