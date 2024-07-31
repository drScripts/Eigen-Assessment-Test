import { config } from 'dotenv';
import path from 'node:path';

export type Config = {
  HOST: string;
  PORT: number;

  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
};

const confgValue = (type: 'DEV' | 'TEST' | 'PROD'): Config => {
  let path: string | undefined;

  switch (type) {
    case 'DEV':
      path = '.env.dev';
      break;
    case 'TEST':
      path = '.env.test';
      break;
    default:
      break;
  }

  config({
    path,
  });

  return {
    HOST: process.env.HOST || '0.0.0.0',
    PORT: parseInt(process.env.PORT || '3000'),

    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: parseInt(process.env.DB_PORT),
  };
};

export const confgValueFromNodeEnv = (): Config => {
  let fileName: string | undefined;
  let override: boolean = false;

  const type = process.env.NODE_ENV ?? 'PROD';

  switch (type.toLowerCase()) {
    case 'dev':
    case 'development':
      fileName = '.env.dev';
      override = true;
      break;
    case 'test':
      fileName = '.env.test';
      override = true;
      break;
    case 'production':
    case 'prod':
      fileName = '.env';
    default:
      break;
  }

  const fullpath = path.resolve(process.cwd(), fileName);

  config({
    path: fullpath,
    override,
  });

  return {
    HOST: process.env.HOST || '0.0.0.0',
    PORT: parseInt(process.env.PORT || '3000'),

    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: parseInt(process.env.DB_PORT),
  };
};

export default confgValue;
