import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import configValue, { Config } from './shared/configs';

const mikroOrmConfig = (
  input?: Config,
  type: 'PROD' | 'DEV' | 'TEST' = 'PROD',
): Parameters<typeof MikroORM.init>[0] => {
  let config: Config = configValue(type);
  if (input) {
    config = input;
  }

  return {
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    dbName: config.DB_NAME,
    driver: MySqlDriver,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: config.DB_PORT,
    migrations: {
      tableName: 'mikro_orm_migrations',
      path: 'dist/migrations',
      pathTs: 'src/migrations',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      disableForeignKeys: true,
      allOrNothing: true,
      emit: 'ts',
    },
  };
};

export default mikroOrmConfig;
