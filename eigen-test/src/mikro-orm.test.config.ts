import { MikroORM } from '@mikro-orm/core';
import configValue from './shared/configs';
import mikroOrmConfig from './mikro-orm.config';

const mikroOrmTestConfig = (): Parameters<typeof MikroORM.init>[0] => {
  const config = configValue('TEST');

  return mikroOrmConfig(config);
};

export default mikroOrmTestConfig;
