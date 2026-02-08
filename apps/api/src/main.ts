import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. 暴力强制 CORS：确保所有响应（包括 404/500）都带有 CORS 头
  app.use((req: any, res: any, next: any) => {
    const allowedOrigins = [
      'https://myskillstore-web.onrender.com',
      'https://myskillshop-web.onrender.com',
      'https://skills-store-api-bjbddhaeathndkap.southeastasia-01.azurewebsites.net',
      'http://localhost:3000',
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true');

    // 直接响应 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
    } else {
      next();
    }
  });

  // 2. 同时保留 NestJS 标准配置作为双重保障
  app.enableCors({
    origin: [
      'https://myskillstore-web.onrender.com',
      'https://myskillshop-web.onrender.com',
      'http://localhost:3000',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 8080);
  console.log(`API running on port ${process.env.PORT ?? 8080}`);
}
bootstrap();
