import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  app.enableCors({
    origin: [
      'http://localhost:3100',   
    ].filter(Boolean),        
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: true,
    maxAge: 86400,               
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,           
      transformOptions: {
        enableImplicitConversion: true, 
      },
    })
  );

  const port = process.env.PORT ?? 3456;
  await app.listen(port);
  console.log(`Application is running on port ${port} with CORS enabled for development origins`);
}
bootstrap();