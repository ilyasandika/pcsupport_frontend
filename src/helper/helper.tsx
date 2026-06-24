import type {IErrors} from "../types/api.type.ts";

export const capitalizeWords = (text: string) => {
    return text
	.split(' ')
	.map(word => word.charAt(0).toUpperCase() + word.slice(1))
	.join(' ');
}

export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const findFieldError = (errors: IErrors[], field: string):  string[] | undefined => {
    return errors.find(err => err.field === field)?.message
}