import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AxiosClient {
    private endpoint: string;
    private globalHeaders: Record<string, string>;
    private httpService: HttpService;

    constructor() {
        this.httpService = new HttpService();
        this.endpoint = process.env.PRODUCT_URL;
        this.globalHeaders = {
            'content-type': 'application/json',
        };
    }

    /**
     * Sets the headers for the HTTP request.
     * If no custom headers are provided, it uses global headers.
     * @param header Custom headers for the request.
     * @returns Headers for the HTTP request.
     */
    private setHeader(header: object | null) {
        if (header === null) {
            return this.globalHeaders;
        } else {
            return header = {
                Authorization: this.globalHeaders['Authorization'],
            };
        }
    }

    /**
     * Performs a GET request to the specified API endpoint.
     * @param apiUrl The endpoint to call.
     * @param params Optional query parameters for the request.
     * @param authorizationHeader Optional authorization header for the request.
     * @returns Response data from the API or null if no data is returned.
     */
    public async getCall(apiUrl: string, params: any = null, authorizationHeader: any = null) {
        try {
            const headers = this.setHeader(authorizationHeader);
            const url = `${this.endpoint}${apiUrl}`;
            const response = await this.httpService.axiosRef.get(url, { headers });
            return response.data ? response.data : null;
        } catch (error) {
            throw new Error(error?.message);
        }
    }
}