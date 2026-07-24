import {
  BadRequestException,
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

function registerGlobals(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const fields = errors.map((error) => error.property);
        const message = errors
          .flatMap((error) => Object.values(error.constraints ?? {}))
          .map((m) => m.slice(0, 1).toUpperCase() + m.slice(1))
          .join('. ');
        return new BadRequestException({
          message,
          fields,
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        });
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
