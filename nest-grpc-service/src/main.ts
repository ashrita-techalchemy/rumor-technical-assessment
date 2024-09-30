import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

/**
 * Initializes and starts the NestJS application along with gRPC microservices.
 * - Creates the NestJS application instance.
 * - Connects to gRPC microservices using the provided options.
 * - Starts all connected gRPC microservices.
 * - Starts listening for incoming requests on port.
 * - Logs the URL where the application is running.
 */
async function bootstrap() {

    const port = process.env.GRPC_PORT || 5003;
    const url = `0.0.0.0:${port}`;

    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>(
        {
            transport: Transport.GRPC,
            options: {
                package: 'product',
                protoPath: path.join(__dirname, './proto/product.proto'),
                url: url,
            },
        },
    );
    await app.startAllMicroservices();
    const config = new DocumentBuilder()
      .setTitle('GRPC Product API')
      .setDescription('API for managing products')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/grpc-product-service', app, document);

    await app.listen(process.env.PORT);
    console.log(`gRPC service is running on: ${url}`);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
