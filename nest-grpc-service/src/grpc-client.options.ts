import { ReflectionService } from '@grpc/reflection';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

/**
 * Options for gRPC client configuration.
 */
export const grpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'product', // ['product', 'hero2']
        protoPath: join(__dirname, './product/product.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
        // packageDefinition: (pkg, server) => {
        //     new ReflectionService(pkg).addToServer(server);
        // },
    },
};