/**
 * Interface representing a request to manipulate product quantity.
 */
export interface ProductRequest {
    productId: string;
    quantity: number;
}

/**
 * Interface representing a response indicating product availability.
 */
export interface ProductResponse {
    available: boolean;
}
