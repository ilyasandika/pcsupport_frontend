export interface IErrors {
    field: string;
    message: string[];
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

export interface IResponse<T> extends IBaseResponse {
    data: T;
}