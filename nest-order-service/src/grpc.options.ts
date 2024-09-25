import { Transport } from '@nestjs/microservices';
import * as path from 'path';

/**
 * Options for gRPC client configuration.
 */
export const grpcClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'product',
        protoPath: path.join(
            __dirname,
            '../../grpc-service/src/proto/product.proto',
        ),
    },
};
