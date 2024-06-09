import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGINS.split(','),
        optionsSuccessStatus: 200,
    });
    // app lisening
    await app.listen(process.env.PORT || 4000);
}
bootstrap();
