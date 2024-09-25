import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Initializes and starts the NestJS application.
 * 
 * - Creates the application instance.
 * - Configures Swagger documentation for the Product API.
 * - Sets up Swagger UI endpoint.
 * - Starts listening for incoming requests on the defined port.
 * - Logs the URL where the application is running.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Order API')
        .setDescription('API for managing orders')
        .setVersion('1.0')
        .addTag('orders')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/order-service', app, document);

    await app.listen(process.env.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
