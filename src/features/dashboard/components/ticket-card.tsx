import type {LucideIcon} from "lucide-react";
import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import type {ReactNode} from "react";

interface ticketCardProps {
    label: string,
    value: number,
    status: 'progress' | 'open' | 'closed' |'total' | 'cancelled',
    Icon: LucideIcon
    description?: string | ReactNode;
}

export const TicketCard = ({label, value, status, Icon, description}: ticketCardProps) => {
    const statusStyle = {
	total : {
	    text: 'text-ptba-foreground',
	    bg: 'bg-ptba-primary-navy/20'
	},
	progress: {
	    text: 'text-ptba-secondary-orange',
	    bg: 'bg-ptba-secondary-orange/20'
	},
	open: {
	    text: 'text-ptba-primary-yellow',
	    bg: 'bg-ptba-primary-yellow/20'
	},
	closed: {
	    text: 'text-ptba-tertiary-green',
	    bg: 'bg-ptba-tertiary-green/20'
	},
	cancelled: {
	    text: 'text-ptba-gray',
	    bg: 'bg-ptba-gray/20'
	},
    }

    const currentStyle = statusStyle[status];

    return (
	<Card id={label} className="gap-0">
	    <CardHeader className="flex items-center justify-between">
		<CardTitle className="text-sm font-medium">
		    {label}
		</CardTitle>
		<CardAction className={cn(currentStyle.bg, "rounded-lg p-2")}>
		    <Icon className={cn(currentStyle.text, "h-4 w-4")}/>
		</CardAction>
	    </CardHeader>
	    <CardContent className="">
		<div className="text-xl text-ptba-primary-navy sm:text-3xl font-bold mb-1">{value}</div>
		{
		    typeof description === "string" && <div className=" text-xs text-ptba-primary-navy  sm:text-sm">{description}</div>
		}
		{
		    typeof description === "object" && description
		}
	    </CardContent>
	</Card>


    )
}