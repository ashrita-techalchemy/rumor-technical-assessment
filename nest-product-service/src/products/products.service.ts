import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { GrpcMethod } from '@nestjs/microservices';
import {
    ProductRequest,
    ProductResponse,
} from '../interface/product.interface';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    /**
     * Check the availability of a product.
     * @param data - Product request data containing the productId.
     * @returns A ProductResponse indicating whether the product is available.
     */
    @GrpcMethod('GrpcServices', 'productAvailability')
    async productAvailability(
        data: ProductRequest,
    ): Promise<ProductResponse> {
        const product = await this.findOne(data.productId);
        return { available: product.quantity >= 1 };
    }

    /**
     * Create a new product.
     * @param productData - Partial data of the product to be created.
     * @returns The created product.
     */
    async create(productData: Partial<Product>): Promise<Product> {
        const product = this.productRepository.create(productData);
        return this.productRepository.save(product);
    }

    /**
     * Find all products optionally filtered by IDs.
     * @param ids - Optional comma-separated IDs to filter the products.
     * @returns An array of products.
     */
    async findAll(ids?: string): Promise<Product[]> {
        let where = {}
        if (ids) {
            where = { id: In(ids.split(",")) }
        }
        return this.productRepository.find({ where });
    }

    /**
     * Find a product by ID.
     * @param id - The ID of the product to find.
     * @returns The found product.
     */
    async findOne(id): Promise<Product> {
        return this.productRepository.findOne({ where: { id } });
    }

    /**
     * Update a product by ID.
     * @param id - The ID of the product to update.
     * @param productData - Partial data of the product to be updated.
     * @returns The updated product.
     */
    async update(id, productData: Partial<Product>): Promise<Product> {
        await this.productRepository.update({ id }, productData);
        return this.productRepository.findOne({ where: { id } });
    }

    /**
     * Delete a product by ID.
     * @param id - The ID of the product to delete.
     */
    async delete(id: number): Promise<void> {
        await this.productRepository.delete(id);
    }
}
