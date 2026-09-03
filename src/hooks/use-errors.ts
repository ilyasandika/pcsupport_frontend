import { type Dispatch, type SetStateAction, useState } from "react";
import type { IErrors } from "@/types/api.type.ts";

export const useFormErrors = (): {
    errors: IErrors[];
    setErrors: Dispatch<SetStateAction<IErrors[]>>;
    getFieldErrors: (field: string) => string[] | undefined;
    clearErrors: () => void;
    generalErrors: string[] | undefined;
} => {
    const [errors, setErrors] = useState<IErrors[]>([]);

    const getFieldErrors = (field: string) =>
        errors.find(err => err.field === field)?.message;

    const clearErrors = () => {
        setErrors([]);
    }

    const generalErrors: string[] | undefined = getFieldErrors("general");

    return { errors, setErrors, getFieldErrors, clearErrors, generalErrors };
}