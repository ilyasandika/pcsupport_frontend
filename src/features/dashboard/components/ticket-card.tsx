import type { LucideIcon } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import type { ReactNode } from "react";
import type { IEngineerCount } from "@/types/ticket.type.ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip.tsx";

interface ticketCardProps {
	label: string,
	value: number,
	status: 'progress' | 'open' | 'closed' | 'total' | 'cancelled',
	Icon: LucideIcon,
	description?: string | ReactNode;
	engineerBreakdown?: IEngineerCount[];
}

export const TicketCard = ({ label, value, status, Icon, description, engineerBreakdown }: ticketCardProps) => {
	const statusStyle = {
		total: {
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

	const cardContent = (
		<Card id={label} className="gap-0 transition-shadow hover:shadow-md cursor-pointer">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-sm font-medium">
					{label}
				</CardTitle>
				<CardAction className={cn(currentStyle.bg, "rounded-lg p-2")}>
					<Icon className={cn(currentStyle.text, "h-4 w-4")} />
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
	);

	if (!engineerBreakdown || engineerBreakdown.length === 0) {
		return cardContent;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				{cardContent}
			</TooltipTrigger>
			<TooltipContent side="bottom" align="start" className="bg-white border border-slate-200 text-slate-900 p-3 shadow-xl rounded-xl space-y-2">
				<div className="space-y-1 overflow-y-auto pr-1">
					{engineerBreakdown.map((item, idx) => (
						<div key={item.engineerId || `unassigned-${idx}`} className="flex justify-between items-center text-xs py-0.5 gap-10">
							<span className="truncate text-slate-700 font-medium" title={item.engineerName}>
								{item.engineerName}
							</span>
							<span className="font-bold text-ptba-primary bg-ptba-primary/10 px-1.5 py-0.5 rounded text-[11px]">
								{item.count}
							</span>
						</div>
					))}
				</div>
			</TooltipContent>
		</Tooltip>
	)
}