import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { grpcClientOptions } from '../grpc-client.options';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { GRPCProductService } from './product.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        ClientsModule.register([
            {
                name: 'PRODUCT_PACKAGE',
                ...grpcClientOptions,
            },
        ]),
    ],
    controllers: [ProductController],
    providers: [GRPCProductService]
})
export class ProductModule { }
