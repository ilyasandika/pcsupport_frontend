import {
	CircleCheck,
	Download,
	Eye, FileSearch,
	FileText,
	FileUp,
	FileX,
	Info, KeyRound,
	type LucideIcon,
	SquarePen,
	Trash,
	UserPlus,
	Undo2,
	Power,
	FileCheck,
	Sparkles,
	MoreVertical,
} from "lucide-react";
import React, { type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialogContainer } from "@/components/alert-dialog-container.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const ToolTipContainer = ({ children, text }: {
	children: ReactNode
	text?: string
}) => {
	if (!text) return <>{children}</>;
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				{children}
			</TooltipTrigger>
			<TooltipContent>
				{text}
			</TooltipContent>
		</Tooltip>
	)
}

interface ActionButtonProps {
	onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
	Logo: LucideIcon;
	to?: string;
	className?: string;
	tooltip?: string;
	alert?: {
		title: string;
		description: string;
		variant?: "success" | "danger" | "warning" | "info";
		content?: ReactNode;
		onContinue?: () => void;
		icon?: ReactNode;
	};
}

const ActionButton = ({ Logo, onClick, className, to, tooltip, alert }: ActionButtonProps) => {
	const LinkComp = () => {
		if (to) {
			return (
				<Link
					to={to}
					className={twMerge('p-1.5 text-slate-600 hover:text-ptba-primary rounded-md hover:bg-slate-100 transition-colors inline-flex items-center justify-center cursor-pointer', className)}
				>
					<Logo className='w-4 h-4' />
				</Link>
			)
		}
		return null;
	}

	const ButtonComp = () => {
		return (
			<Button
				variant="ghost"
				size="sm"
				onClick={onClick}
				className={twMerge('h-8 w-8 p-0 text-slate-600 hover:text-ptba-primary hover:bg-slate-100 rounded-md transition-colors cursor-pointer', className)}
			>
				<Logo className='w-4 h-4' />
			</Button>
		)
	}

	if (to) {
		return (
			<ToolTipContainer text={tooltip}>
				{
					alert ?
						<AlertDialogContainer
							triggerRender={<LinkComp />}
							title={alert.title}
							description={alert.description}
							content={alert.content}
							onContinue={alert.onContinue}
							variant={alert.variant}
							icon={alert.icon}
						/>
						:
						<LinkComp />
				}
			</ToolTipContainer>
		)
	} else {
		return (
			<ToolTipContainer text={tooltip}>
				{
					alert ?
						<AlertDialogContainer
							triggerRender={<ButtonComp />}
							title={alert.title}
							content={alert.content}
							description={alert.description}
							onContinue={alert.onContinue}
							variant={alert.variant}
							icon={alert.icon}
						/>
						:
						<ButtonComp />
				}
			</ToolTipContainer>
		)
	}
}

export interface ActionButtonsOptions {
	onClick?: (e: React.MouseEvent) => void;
	to?: string;
	disabled?: boolean;
	tooltip?: string;
	icon?: LucideIcon;
	className?: string;
	alert?: {
		title: string;
		description: string;
		content?: ReactNode;
		variant?: "success" | "danger" | "warning" | "info";
		onContinue?: () => void;
		icon?: ReactNode;
	};
}

export interface ActionButtonsProps {
	edit?: ActionButtonsOptions;
	info?: ActionButtonsOptions;
	remove?: ActionButtonsOptions;
	detail?: ActionButtonsOptions;
	download?: ActionButtonsOptions;
	generateDocument?: ActionButtonsOptions;
	check?: ActionButtonsOptions;
	seeDocument?: ActionButtonsOptions;
	uploadDocument?: ActionButtonsOptions;
	deleteDocument?: ActionButtonsOptions;
	keyButton?: ActionButtonsOptions;
	assign?: ActionButtonsOptions;
	returnAsset?: ActionButtonsOptions;
	toggleStatus?: ActionButtonsOptions;
	externalTicket?: ActionButtonsOptions;
	approve?: ActionButtonsOptions;
	syncTags?: ActionButtonsOptions;
}

export const ActionButtons = ({
	edit,
	info,
	detail,
	download,
	remove,
	generateDocument,
	check,
	seeDocument,
	uploadDocument,
	deleteDocument,
	keyButton,
	assign,
	returnAsset,
	toggleStatus,
	externalTicket,
	approve,
	syncTags,
}: ActionButtonsProps) => {

	const secondaryActions: Array<{
		key: string;
		label: string;
		icon: LucideIcon;
		options: ActionButtonsOptions;
		className?: string;
		isDestructive?: boolean;
	}> = [];

	if (approve && !approve.disabled) {
		secondaryActions.push({
			key: 'approve',
			label: approve.tooltip || 'Approve Ticket',
			icon: approve.icon || FileCheck,
			options: approve,
			className: approve.className || 'text-emerald-600',
		});
	}

	if (syncTags && !syncTags.disabled) {
		secondaryActions.push({
			key: 'syncTags',
			label: syncTags.tooltip || 'Sync AI Tags',
			icon: syncTags.icon || Sparkles,
			options: syncTags,
			className: syncTags.className || 'text-purple-600',
		});
	}

	if (info && !info.disabled) {
		secondaryActions.push({
			key: 'info',
			label: info.tooltip || 'Information',
			icon: info.icon || Info,
			options: info,
			className: info.className || 'text-slate-600',
		});
	}

	if (download && !download.disabled) {
		secondaryActions.push({
			key: 'download',
			label: download.tooltip || 'Download',
			icon: download.icon || Download,
			options: download,
			className: download.className || 'text-emerald-600',
		});
	}

	if (toggleStatus && !toggleStatus.disabled) {
		secondaryActions.push({
			key: 'toggleStatus',
			label: toggleStatus.tooltip || 'Toggle Status',
			icon: toggleStatus.icon || Power,
			options: toggleStatus,
			className: toggleStatus.className || 'text-amber-600',
		});
	}

	if (check && !check.disabled) {
		secondaryActions.push({
			key: 'check',
			label: check.tooltip || 'Close Ticket',
			icon: check.icon || CircleCheck,
			options: check,
			className: check.className || 'text-emerald-600',
		});
	}

	if (externalTicket && !externalTicket.disabled) {
		secondaryActions.push({
			key: 'externalTicket',
			label: externalTicket.tooltip || 'Create External Ticket',
			icon: externalTicket.icon || FileText,
			options: externalTicket,
			className: externalTicket.className || 'text-purple-600',
		});
	}

	if (generateDocument && !generateDocument.disabled) {
		secondaryActions.push({
			key: 'generateDocument',
			label: generateDocument.tooltip || 'Generate Document',
			icon: generateDocument.icon || FileText,
			options: generateDocument,
			className: generateDocument.className || 'text-emerald-600',
		});
	}

	if (uploadDocument && !uploadDocument.disabled) {
		secondaryActions.push({
			key: 'uploadDocument',
			label: uploadDocument.tooltip || 'Upload Document',
			icon: uploadDocument.icon || FileUp,
			options: uploadDocument,
			className: uploadDocument.className || 'text-emerald-600',
		});
	}

	if (seeDocument && !seeDocument.disabled) {
		secondaryActions.push({
			key: 'seeDocument',
			label: seeDocument.tooltip || 'View Document',
			icon: seeDocument.icon || FileSearch,
			options: seeDocument,
			className: seeDocument.className || 'text-blue-600',
		});
	}

	if (keyButton && !keyButton.disabled) {
		secondaryActions.push({
			key: 'keyButton',
			label: keyButton.tooltip || 'Change Password',
			icon: keyButton.icon || KeyRound,
			options: keyButton,
			className: keyButton.className || 'text-slate-700',
		});
	}

	if (assign && !assign.disabled) {
		secondaryActions.push({
			key: 'assign',
			label: assign.tooltip || 'Assign Asset',
			icon: assign.icon || UserPlus,
			options: assign,
			className: assign.className || 'text-emerald-600',
		});
	}

	if (returnAsset && !returnAsset.disabled) {
		secondaryActions.push({
			key: 'returnAsset',
			label: returnAsset.tooltip || 'Return Asset',
			icon: returnAsset.icon || Undo2,
			options: returnAsset,
			className: returnAsset.className || 'text-amber-600',
		});
	}

	if (deleteDocument && !deleteDocument.disabled) {
		secondaryActions.push({
			key: 'deleteDocument',
			label: deleteDocument.tooltip || 'Delete Document',
			icon: deleteDocument.icon || FileX,
			options: deleteDocument,
			className: deleteDocument.className || 'text-red-600',
			isDestructive: true,
		});
	}

	if (remove && !remove.disabled) {
		secondaryActions.push({
			key: 'remove',
			label: remove.tooltip || 'Delete Item',
			icon: remove.icon || Trash,
			options: remove,
			className: remove.className || 'text-red-600',
			isDestructive: true,
		});
	}

	return (
		<div className="flex items-center gap-1">
			{/* Quick Action 1: Detail */}
			{detail && !detail.disabled && (
				<ActionButton
					Logo={detail.icon || Eye}
					to={detail.to}
					onClick={detail.onClick}
					tooltip={detail.tooltip || 'Detail'}
					alert={detail.alert}
					className={detail.className || 'text-amber-600 hover:text-amber-800'}
				/>
			)}

			{/* Quick Action 2: Edit */}
			{edit && !edit.disabled && (
				<ActionButton
					Logo={edit.icon || SquarePen}
					to={edit.to}
					onClick={edit.onClick}
					tooltip={edit.tooltip || 'Edit'}
					alert={edit.alert}
					className={edit.className || 'text-blue-600 hover:text-blue-800'}
				/>
			)}

			{/* Dropdown for Secondary Actions */}
			{secondaryActions.length > 0 && (
				<DropdownMenu>
					<ToolTipContainer text="More Actions">
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
							>
								<MoreVertical className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>
					</ToolTipContainer>
					<DropdownMenuContent align="end" className="w-52 p-1.5 space-y-0.5 shadow-xl border border-slate-200/80 bg-white">
						<DropdownMenuLabel className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">
							More Actions
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="my-1 bg-slate-100" />
						{secondaryActions.map((action) => {
							const Icon = action.icon;
							const opt = action.options;

							const renderItemContent = () => (
								<DropdownMenuItem
									disabled={opt.disabled}
									className={twMerge(
										"flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors",
										action.isDestructive
											? "text-red-600 focus:bg-red-50 focus:text-red-700"
											: "text-slate-700 focus:bg-slate-100 focus:text-slate-900"
									)}
									onClick={(e) => {
										if (!opt.alert && !opt.to && opt.onClick) {
											opt.onClick(e);
										}
									}}
									onSelect={(e) => {
										if (opt.alert) {
											e.preventDefault();
										}
									}}
								>
									<Icon className={twMerge("w-4 h-4 shrink-0", action.className)} />
									<span className="truncate">{action.label}</span>
								</DropdownMenuItem>
							);

							if (opt.to) {
								return (
									<Link key={action.key} to={opt.to} className="block">
										{renderItemContent()}
									</Link>
								);
							}

							if (opt.alert) {
								return (
									<AlertDialogContainer
										key={action.key}
										title={opt.alert.title}
										description={opt.alert.description}
										content={opt.alert.content}
										onContinue={opt.alert.onContinue}
										variant={opt.alert.variant}
										icon={opt.alert.icon}
										triggerRender={renderItemContent()}
									/>
								);
							}

							return <React.Fragment key={action.key}>{renderItemContent()}</React.Fragment>;
						})}
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</div>
	);
};