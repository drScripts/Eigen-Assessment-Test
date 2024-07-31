import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import configValue from './shared/configs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExceptionsFilter } from './shared/exceptions/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      bufferLogs: true,
    },
  );

  app.useGlobalFilters(new ExceptionsFilter());

  app.enableShutdownHooks();

  app.use('/docs', (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Basic ')) {
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      );
      const [username, password] = credentials.split(':');

      if (username === 'eigen' && password === 'eigen_api') {
        next();
        return;
      }
    }

    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
    res.end('Unauthorized');
  });

  const config = new DocumentBuilder()
    .setTitle('Eigen Test Docs')
    .setVersion('1.0')
    .addTag('Eigen')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const appConfig = configValue('PROD');

  await app.listen(appConfig.PORT, appConfig.HOST);
}

bootstrap();
