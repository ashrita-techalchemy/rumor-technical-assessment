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
}
