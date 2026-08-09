import { AssetStatus, type AssetStatusType } from "@/types/asset.type.ts";
import { TicketStatus, type TicketStatusType } from "@/types/ticket.type.ts";

export interface IStyleHelper {
	bg?: string;
	text?: string;
	border?: string;
	hover?: string;
	active?: string;
}


export const getPriorityStyles: Record<"high" | "medium" | "normal" | "low", IStyleHelper> = {
	high: {
		bg: "bg-red-50",
		text: "text-red-600",
		border: "border-red-200"
	},
	medium: {
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200"
	},
	normal: {
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200"
	},
	low: {
		bg: "bg-blue-50",
		text: "text-blue-600",
		border: "border-blue-200"
	},
};

export const getAssetStatusStyles: Record<AssetStatusType, IStyleHelper> = {
	[AssetStatus.Assigned]: {
		bg: "bg-blue-50",
		text: "text-blue-700",
		border: "border-blue-200"
	},
	[AssetStatus.AssignedForBackup]: {
		bg: "bg-blue-50",
		text: "text-blue-700",
		border: "border-blue-200"
	},
	[AssetStatus.ReadyStock]: {
		bg: "bg-emerald-50",
		text: "text-emerald-700",
		border: "border-emerald-200"
	},
	[AssetStatus.Undeployed]: {
		bg: "bg-slate-50",
		text: "text-slate-600",
		border: "border-slate-200"
	},
	[AssetStatus.Damaged]: {
		bg: "bg-red-50",
		text: "text-red-700",
		border: "border-red-200"
	},
	[AssetStatus.Offline]: {
		bg: "bg-zinc-100",
		text: "text-zinc-500",
		border: "border-zinc-300"
	},
	[AssetStatus.Returned]: {
		bg: "bg-amber-50",
		text: "text-amber-700",
		border: "border-amber-200"
	},
	[AssetStatus.Missing]: {
		bg: "bg-purple-50",
		text: "text-purple-700",
		border: "border-purple-200"
	},
	[AssetStatus.Backup]: {
		bg: "bg-cyan-50",
		text: "text-cyan-700",
		border: "border-cyan-200"
	},
	[AssetStatus.Unknown]: {
		bg: "bg-yellow-50",
		text: "text-yellow-700",
		border: "border-yellow-200"
	},

	[AssetStatus.PendingBAST]: {
		bg: "bg-yellow-50",
		text: "text-yellow-700",
		border: "border-yellow-200"
	},
};


const closedStyleHelper: IStyleHelper = {
	bg: "bg-ptba-primary-navy",
	text: "text-white",
};

export const getTicketStatusStyles: Record<TicketStatusType, IStyleHelper> = {
	[TicketStatus.Open]: {
		bg: "bg-success",
		text: "text-white",
	},
	[TicketStatus.Pending]: {
		bg: "bg-ptba-primary-yellow",
		text: "text-white",
	},
	[TicketStatus.InProgress]: {
		bg: "bg-ptba-primary-yellow",
		text: "text-white",
	},
	[TicketStatus.Cancelled]: {
		bg: "bg-ptba-gray",
		text: "text-white",
	},
	[TicketStatus.ClosedRemote]: closedStyleHelper,
	[TicketStatus.ClosedVisit]: closedStyleHelper,
	[TicketStatus.ClosedOnsite]: closedStyleHelper,
	[TicketStatus.Resolved]: closedStyleHelper,
};

export const getStatusBadgeStyle = (status: TicketStatusType | string): string => {
	const style = getTicketStatusStyles[status as TicketStatusType];
	if (!style) return "";
	return `${style.bg ?? ""} ${style.text ?? ""} ${style.border ?? ""}`.trim();
};

export const getEmployeeStatusStyles = (val: string | undefined | null): IStyleHelper => {
	if (val) {
		const safeVal = val.toUpperCase();
		if (safeVal.includes("ON")) {
			return {
				bg: "bg-success",
				text: "text-white",
				border: "border-green-500"
			};
		}
		if (safeVal.includes("OFF")) {
			return {
				bg: "bg-ptba-gray",
				text: "text-white",
				border: "border-gray-500"
			};
		}
	}
	return {
		bg: "bg-zinc-100",
		text: "text-zinc-500",
		border: "border-zinc-300"
	};
};

export interface ISlaStyleHelper {
	header: string;
	accentText: string;
	hourType: string;
}

export const getSlaStyleByDuration = (seconds: number): ISlaStyleHelper => {
	const hours = seconds / 3600;

	if (hours <= 4) {
		return {
			header: "bg-ptba-primary-red text-white",
			accentText: "text-white",
			hourType: "bg-red-700 text-white"
		};
	}
	if (hours <= 24) {
		return {
			header: "bg-ptba-primary-yellow text-slate-900",
			accentText: "text-amber-900",
			hourType: "bg-yellow-500 text-slate-900"
		};
	}

	return {
		header: "bg-slate-900 text-white",
		accentText: "text-blue-400",
		hourType: "bg-slate-800 text-white"
	};
};

export const getProgressStyle = (percentage: number): string => {
	if (percentage >= 75) {
		return "*:bg-ptba-primary-red";
	}

	if (percentage >= 50) {
		return "*:bg-ptba-primary-yellow";
	}

	return "*:bg-ptba-tertiary-green";
};