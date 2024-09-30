import {
  ClientGrpc,
  GrpcMethod,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ProductById } from '../interface/product-by-id.interface';
import { Product as ProdInterface} from '../interface/product.interface';
import { GRPCProductService } from './product.service';

import {
  Controller,
  Get,
  Inject,
  Post,
  Body,
  OnModuleInit,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

// Interface defining the structure of the ProductService
interface ProductService {
  findOne(data: ProductById): Observable<Product>;
  findMany(upstream: Observable<ProductById>): Observable<Product>;
}

@ApiTags('Products')
@Controller('products')
export class ProductController implements OnModuleInit {
  private readonly items: ProdInterface[] = [
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
     * Creates a new product.
     * @param createProductDto - The data to create the product.
     * @returns A response indicating success or failure along with the created product data.
     */
    @Post()
    @ApiOperation({ summary: 'Create Product' })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'The product has been successfully created.',
    })
    @ApiBody({ type: CreateProductDto })
    async create(@Body() createProductDto: CreateProductDto) {
        try {
            const product = await this.grpcProductService.create(createProductDto);
            return { status: HttpStatus.CREATED, success: true, data: product };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Retrieves a list of all products.
     * @param ids - Optional parameter to filter products by IDs.
     * @returns A response containing the list of products.
     */
    @Get()
    @ApiOperation({ summary: 'List of all products' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'List of products',
        type: Product,
    })
    @ApiQuery({ name: 'ids', type: String, required: false })
    async findAll(@Query('ids') ids?: string) {
        try {
            const products = await this.grpcProductService.findAll(ids);
            return { status: HttpStatus.OK, success: true, data: products };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Retrieves details of a specific product.
     * @param id - The ID of the product to retrieve.
     * @returns A response containing the product details.
     */
    @Get(':id')
    @ApiOperation({ summary: 'Product details' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Product details',
        type: Product,
    })
    @ApiParam({ name: 'id', type: String })
    async findOne(@Param('id') id: string) {
        try {
            const product = await this.grpcProductService.findOne(+id);
            if (product) {
                return { status: HttpStatus.OK, success: true, data: product };
            } else {
                return { success: false, message: 'No data found' };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Updates details of a specific product.
     * @param id - The ID of the product to update.
     * @param updateProductDto - The data to update the product.
     * @returns A response indicating success or failure along with the updated product data.
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Update product' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The product has been successfully updated.',
    })
    @ApiBody({ type: UpdateProductDto })
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        try {
            const product = await this.grpcProductService.update(
                +id,
                updateProductDto,
            );
            return { status: HttpStatus.OK, success: true, data: product };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Deletes a specific product.
     * @param id - The ID of the product to delete.
     * @returns A response indicating success or failure.
     */
    @Delete(':id')
    @ApiOperation({ summary: 'Delete product' })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'The product has been successfully deleted.',
    })
    @ApiParam({ name: 'id', type: String })
    async delete(@Param('id') id: string) {
        try {
            const data = this.grpcProductService.delete(+id);
            return { status: HttpStatus.NO_CONTENT, success: true, data };
        } catch (error) {
            return { success: false, message: error.message };
        }
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
