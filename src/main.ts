import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const cors = process.env.CORS_ORIGINS.split(',');

    console.log(
        '🚀 >>>>>> file: main.ts:8 >>>>>> bootstrap >>>>>> cors:',
        cors,
    );
    app.enableCors({
        origin: process.env.CORS_ORIGINS.split(','),
        optionsSuccessStatus: 200,
    });
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
