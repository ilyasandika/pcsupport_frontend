import type { IErrors } from "../types/api.type.ts";
import type { ColumnFiltersState } from "@tanstack/react-table";

export const columnFiltersToParams = (filters: ColumnFiltersState) => {
    return filters.reduce((acc, filter) => {
        acc[filter.id] = filter.value;
        return acc;
    }, {} as Record<string, unknown>);
}

export const capitalizeWords = (text: string, variant: "each" | "only first" = "each"): string => {
    if (variant === "only first") {
        return (
            text.charAt(0).toUpperCase() + text.slice(1)
        )
    } else if (variant === "each") {
        return text
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        text.charAt(0).toUpperCase() + text.slice(1)
    )
}

export const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const findFieldError = (errors: IErrors[], field: string): string[] | undefined => {
    return errors.find(err => err.field === field)?.message
}


export const byteToStringMb = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
};


export const monthsDaysBetween = (startStr: string, endStr: string) => {
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    let days = end.getDate() - start.getDate();
    if (days < 0) {
        months -= 1;
        days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) { months = 0; days = 0; }
    return { months, days };
}



export const fmtDate = (d?: string) =>
    d
        ? new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
        })
        : "—";

export type TimeHMS = {
    hours: number;
    minutes: number;
    seconds: number;
};

export const secondsToHMS = (totalSeconds: number): TimeHMS => {
    const validSeconds = Math.max(0, Math.floor(totalSeconds));

    const hours = Math.floor(validSeconds / 3600);
    const minutes = Math.floor((validSeconds % 3600) / 60);
    const seconds = validSeconds % 60;

    return {
        hours,
        minutes,
        seconds,
    };
}

export const dateStringToSeconds = (dateString: string) => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000);
}


/**
 * Menghitung persentase dan mengembalikannya sebagai string berformat
 * @param actual Nilai aktual yang dicapai
 * @param target Nilai target yang ditentukan
 * @param decimals Jumlah angka di belakang koma (default: 0)
 * @returns String persentase (contoh: "85%")
 */
export function getPercentage(actual: number, target: number, decimals: number = 0): number {
    if (target === 0) {
        return 0;
    }
    const percentage = (actual / target) * 100;
    return Number(percentage.toFixed(decimals));
}

export const isTicketSolved = (ticketStatus: string) => {
    if (ticketStatus == "open") {
        return false
    }
    if (ticketStatus == "in progress") {
        return false
    }
    if (ticketStatus == "pending") {
        return false
    }

    if (ticketStatus == "cancelled") {
        return false
    }
    return true
}

export const isTicketOpen = (ticketStatus: string) => ticketStatus == "open"
export const isTicketPending = (ticketStatus: string) => ticketStatus == "pending"
export const isTicketInProgress = (ticketStatus: string) => ticketStatus == "in progress"
export const isTicketCancelled = (ticketStatus: string) => ticketStatus == "cancelled"

export const isTicketProgressGroup = (ticketStatus: string) => ticketStatus == "in progress" || ticketStatus == "pending"

export const getLocalDatetime = (dateString?: string | null) => {
    if (dateString === null || dateString === "") return "";
    const date = dateString ? new Date(dateString) : new Date();
    if (isNaN(date.getTime())) return "";
    const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return localTime.toISOString().slice(0, 16);
};


export function calculateSlaMetric(startDateString: string, endDateString: string, targetSeconds: number) {
    const actualSeconds = startDateString && endDateString
        ? dateStringToSeconds(endDateString) - dateStringToSeconds(startDateString)
        : 0;

    return {
        target: secondsToHMS(targetSeconds),
        actual: secondsToHMS(actualSeconds),
        percentage: getPercentage(actualSeconds, targetSeconds),
    };
}

