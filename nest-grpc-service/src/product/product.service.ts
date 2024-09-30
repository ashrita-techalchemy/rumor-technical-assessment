import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';

@Injectable()
export class GRPCProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    /**
     * Find a product by ID.
     * @param id - The ID of the product to find.
     * @returns The found product.
     */
    async findOne(id): Promise<Product> {
        return await this.productRepository.findOne({ where: { id } });
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
