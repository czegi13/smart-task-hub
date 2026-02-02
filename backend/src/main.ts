import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Ezeket importáld be
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptors';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger konfiguráció összeállítása
  const config = new DocumentBuilder()
    .setTitle('Smart Task Hub API')
    .setDescription('A feladatkezelőnk backend dokumentációja')
    .setVersion('1.0')
    .build();

  // A dokumentáció létrehozása
  const document = SwaggerModule.createDocument(app, config);
  
  // Elérési út beállítása (pl. localhost:3000/api)
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();