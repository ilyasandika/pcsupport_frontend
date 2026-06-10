import type {LucideIcon} from "lucide-react";
import {capitalizeWords} from "../../../helper/helper.tsx";

interface ticketCardProps {
    label: string,
    value: number,
    status: 'progress' | 'open' | 'closed' |'total',
    Icon: LucideIcon
}

export const TicketCard = ({label, value, status, Icon}: ticketCardProps) => {
    const statusStyle = {
	total : {
	    text: 'text-ptba-common',
	    bg: 'bg-ptba-common/20'
	},
	progress: {
	    text: 'text-ptba-orange',
	    bg: 'bg-ptba-orange/20'
	},
	open: {
	    text: 'text-ptba-yellow',
	    bg: 'bg-ptba-yellow/20'
	},
	closed: {
	    text: 'text-ptba-green',
	    bg: 'bg-ptba-green/20'
	},
    }

    const currentStyle = statusStyle[status];

    return (
	<div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
	    <div className="flex items-center justify-between mb-3">
		<Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${currentStyle.text}`} />
		<span className={`text-xs font-medium ${currentStyle.bg} px-2 sm:px-3 py-1 rounded-full`}>{capitalizeWords(status)}</span>
	    </div>
	    <div className="text-xl sm:text-3xl font-bold mb-1">{value}</div>
	    <div className="text-blue-100 text-xs sm:text-sm">{label}</div>
	</div>
    )
}