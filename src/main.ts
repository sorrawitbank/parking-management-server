import {
  BadRequestException,
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import toScreamingSnake from './utils/to-screaming-snake';

function registerGlobals(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}).map(
            (constraint) => `${toScreamingSnake(error.property)}_${constraint}`,
          ),
        );
        const fields = errors.reduce(
          (prev, curr) => ({
            ...prev,
            [curr.property]: Object.values(curr.constraints ?? {})[0],
          }),
          {},
        );
        return new BadRequestException({ messages, fields });
      },
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  registerGlobals(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
