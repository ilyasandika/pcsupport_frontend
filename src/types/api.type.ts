export interface IErrors {
    field: string;
    message: string[];
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface IBaseResponse {
    success: boolean;
    statusCode: number;
    message: string;
    path: string;
    timestamp: string;
}

export interface IErrorResponse extends IBaseResponse {
    errors: IErrors[];
}

export interface ISuccessResponse<T> extends IBaseResponse {
    data: T;
    meta?: PaginationMeta;
}