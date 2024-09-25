import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcClientOptions } from './grpc-client.options';

/**
 * Initializes and starts the NestJS application along with gRPC microservices.
 * - Creates the NestJS application instance.
 * - Connects to gRPC microservices using the provided options.
 * - Starts all connected gRPC microservices.
 * - Starts listening for incoming requests on port.
 * - Logs the URL where the application is running.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice<MicroserviceOptions>(grpcClientOptions);
    await app.startAllMicroservices();
    await app.listen(process.env.PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
