import { MikroORM } from '@mikro-orm/core';
import configValue from './shared/configs';
import mikroOrmConfig from './mikro-orm.config';

const mikroOrmDevConfig = (): Parameters<typeof MikroORM.init>[0] => {
  const config = configValue('DEV');

  return mikroOrmConfig(config);
};

export default mikroOrmDevConfig;
