import { Controller, Get, Inject, OnModuleInit, Param } from '@nestjs/common';
import {
  ClientGrpc,
  GrpcMethod,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ProductById } from '../interface/product-by-id.interface';
import { Product } from '../interface/product.interface';
import { GRPCProductService } from './product.service';

// Interface defining the structure of the ProductService
interface ProductService {
  findOne(data: ProductById): Observable<Product>;
  findMany(upstream: Observable<ProductById>): Observable<Product>;
}

@Controller('product')
export class ProductController implements OnModuleInit {
  private readonly items: Product[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Doe' },
  ];
  private productService: ProductService;

  constructor(
    @Inject('PRODUCT_PACKAGE') private readonly client: ClientGrpc,
    private readonly grpcProductService: GRPCProductService
  ) { }

  // Lifecycle hook to initialize the product service
  onModuleInit() {
    this.productService = this.client.getService<ProductService>('ProductService');
  }

  /**
   * Endpoint to retrieve a product by its ID.
   * @param id The ID of the product.
   * @returns An observable emitting the product with the specified ID.
   */
  @Get(':id')
  getById(@Param('id') id: string): Observable<Product> {
    return this.productService.findOne({ id: +id });
  }

  /**
   * gRPC method to find a product by its ID.
   * @param data Contains the ID of the product to find.
   * @returns The product with the specified ID.
   */
  @GrpcMethod('ProductService', 'getProduct')
  async getProduct(data: ProductById): Promise<Product> {
    return await this.grpcProductService.findOne(data.id);
  }
}
