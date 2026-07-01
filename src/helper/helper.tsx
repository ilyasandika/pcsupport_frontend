import type {IErrors} from "../types/api.type.ts";
import {TicketStatus, type TicketStatusType} from "../types/ticket.type.ts";

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

export const getStatusBadgeStyle = (value: TicketStatusType) => {
    const closedStyle = 'bg-ptba-primary/10 text-ptba-primary border-ptba-primary/20'
    const statusStyles = {
	[TicketStatus.Open]: 'bg-ptba-green/10 text-ptba-green border-ptba-green/20',
	[TicketStatus.Pending]: 'bg-ptba-yellow/10 text-ptba-yellow  border-ptba-yellow/20',
	[TicketStatus.InProgress]: 'bg-ptba-yellow/10 text-ptba-orange  border-ptba-yellow/20',

	[TicketStatus.ClosedRemote]: closedStyle,
	[TicketStatus.ClosedVisit]: closedStyle,
	[TicketStatus.ClosedOnsite]: closedStyle,
	[TicketStatus.Resolved]: closedStyle,
    }
    return statusStyles[value]
}

export const getSlaStyleByDuration = (seconds: number) => {
    const hours = seconds / 3600;

    if (hours <= 4) {
	return {
	    header: "bg-ptba-red text-white",
	    accentText: "text-white",
	    hourType: 'bg-red-700 text-white'
	};
    }
    if (hours <= 24) {
	return {
	    header: "bg-ptba-yellow text-slate-900",
	    accentText: "text-amber-900",
	    hourType: 'bg-yellow-500 text-slate-900'
	};
    }

    return {
	header: "bg-slate-900 text-white",
	accentText: "text-blue-400"
    };
};
