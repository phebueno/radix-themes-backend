import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('RadixThemes - REST API Documentation')
    .setDescription(
      `This API provides a set of services for managing themes
      and their associated links, enabling the creation, listing, 
      updating, and deletion of themes, as well as associating relevant
      links with them. It supports pagination in its routes, allowing
      efficient navigation of large datasets.`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`Server is up and runnning on port ${port}`);
  });
}
bootstrap();
