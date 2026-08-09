import type {IErrorResponse} from "@/types/api.type.ts";

export const isErrorResponse = (error: any): error is IErrorResponse => {
    return (
	typeof error === 'object' &&
	error !== null &&

	typeof error.success === 'boolean' &&
	typeof error.statusCode === 'number' &&
	typeof error.message === 'string' &&
	typeof error.path === 'string' &&
	typeof error.timestamp === 'string' &&

	Array.isArray(error.errors)
    );
}