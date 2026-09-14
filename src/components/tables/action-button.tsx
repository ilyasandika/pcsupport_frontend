import {
    CircleCheck,
    Download,
    Eye,
    FileSearch,
    FileText,
    FileUp,
    FileX,
    FilePlus,
    Info,
    KeyRound,
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
import React, {type ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {Link} from "react-router";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {AlertDialogContainer} from "@/components/alert-dialog-container.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const ToolTipContainer = ({children, text}: {
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

const ActionButton = ({Logo, onClick, className, to, tooltip, alert}: ActionButtonProps) => {
    const LinkComp = () => {
	if (to) {
	    return (
		<Link
		    to={to}
		    className={twMerge('p-1.5 text-slate-600 hover:text-ptba-primary rounded-md hover:bg-slate-100 transition-colors inline-flex items-center justify-center cursor-pointer', className)}
		>
		    <Logo className='w-4 h-4'/>
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
		<Logo className='w-4 h-4'/>
	    </Button>
	)
    }

    const renderElement = alert ? (
	<AlertDialogContainer
	    triggerRender={to ? <LinkComp/> : <ButtonComp/>}
	    title={alert.title}
	    description={alert.description}
	    content={alert.content}
	    onContinue={alert.onContinue}
	    variant={alert.variant}
	    icon={alert.icon}
	/>
    ) : (
	to ? <LinkComp/> : <ButtonComp/>
    );

    return (
	<ToolTipContainer text={tooltip}>
	    <div>
		{renderElement}
	    </div>
	</ToolTipContainer>
    )
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
    addDocument?: ActionButtonsOptions;
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

interface ActionItem {
    key: string;
    label: string;
    icon: LucideIcon;
    options: ActionButtonsOptions;
    className?: string;
    tooltip?: string;
    isDestructive?: boolean;
}

export const ActionButtons = (props: ActionButtonsProps) => {
    const allActions: ActionItem[] = [];

    if (props.detail && !props.detail.disabled) {
	allActions.push({
	    key: 'detail',
	    label: props.detail.tooltip || 'Detail',
	    icon: props.detail.icon || Eye,
	    options: props.detail,
	    className: props.detail.className || 'text-amber-600 hover:text-amber-800',
	});
    }

    if (props.edit && !props.edit.disabled) {
	allActions.push({
	    key: 'edit',
	    label: props.edit.tooltip || 'Edit',
	    icon: props.edit.icon || SquarePen,
	    options: props.edit,
	    className: props.edit.className || 'text-blue-600 hover:text-blue-800',
	});
    }

    if (props.approve && !props.approve.disabled) {
	allActions.push({
	    key: 'approve',
	    label: props.approve.tooltip || 'Approve Ticket',
	    icon: props.approve.icon || FileCheck,
	    options: props.approve,
	    className: props.approve.className || 'text-emerald-600',
	});
    }

    if (props.syncTags && !props.syncTags.disabled) {
	allActions.push({
	    key: 'syncTags',
	    label: props.syncTags.tooltip || 'Sync AI Tags',
	    icon: props.syncTags.icon || Sparkles,
	    options: props.syncTags,
	    className: props.syncTags.className || 'text-purple-600',
	});
    }

    if (props.info && !props.info.disabled) {
	allActions.push({
	    key: 'info',
	    label: props.info.tooltip || 'Information',
	    icon: props.info.icon || Info,
	    options: props.info,
	    className: props.info.className || 'text-slate-600',
	});
    }

    if (props.download && !props.download.disabled) {
	allActions.push({
	    key: 'download',
	    label: props.download.tooltip || 'Download',
	    icon: props.download.icon || Download,
	    options: props.download,
	    className: props.download.className || 'text-emerald-600',
	});
    }

    if (props.toggleStatus && !props.toggleStatus.disabled) {
	allActions.push({
	    key: 'toggleStatus',
	    label: props.toggleStatus.tooltip || 'Toggle Status',
	    icon: props.toggleStatus.icon || Power,
	    options: props.toggleStatus,
	    className: props.toggleStatus.className || 'text-amber-600',
	});
    }

    if (props.check && !props.check.disabled) {
	allActions.push({
	    key: 'check',
	    label: props.check.tooltip || 'Close Ticket',
	    icon: props.check.icon || CircleCheck,
	    options: props.check,
	    className: props.check.className || 'text-emerald-600',
	});
    }

    if (props.externalTicket && !props.externalTicket.disabled) {
	allActions.push({
	    key: 'externalTicket',
	    label: props.externalTicket.tooltip || 'Create External Ticket',
	    icon: props.externalTicket.icon || FileText,
	    options: props.externalTicket,
	    className: props.externalTicket.className || 'text-purple-600',
	});
    }

    if (props.addDocument && !props.addDocument.disabled) {
	allActions.push({
	    key: 'addDocument',
	    label: props.addDocument.tooltip || 'Add Document',
	    icon: props.addDocument.icon || FilePlus,
	    options: props.addDocument,
	    className: props.addDocument.className || 'text-emerald-600',
	});
    }

    if (props.generateDocument && !props.generateDocument.disabled) {
	allActions.push({
	    key: 'generateDocument',
	    label: props.generateDocument.tooltip || 'Generate Document',
	    icon: props.generateDocument.icon || FileText,
	    options: props.generateDocument,
	    className: props.generateDocument.className || 'text-emerald-600',
	});
    }

    if (props.uploadDocument && !props.uploadDocument.disabled) {
	allActions.push({
	    key: 'uploadDocument',
	    label: props.uploadDocument.tooltip || 'Upload Document',
	    icon: props.uploadDocument.icon || FileUp,
	    options: props.uploadDocument,
	    className: props.uploadDocument.className || 'text-emerald-600',
	});
    }

    if (props.seeDocument && !props.seeDocument.disabled) {
	allActions.push({
	    key: 'seeDocument',
	    label: props.seeDocument.tooltip || 'View Document',
	    icon: props.seeDocument.icon || FileSearch,
	    options: props.seeDocument,
	    className: props.seeDocument.className || 'text-blue-600',
	});
    }

    if (props.keyButton && !props.keyButton.disabled) {
	allActions.push({
	    key: 'keyButton',
	    label: props.keyButton.tooltip || 'Change Password',
	    icon: props.keyButton.icon || KeyRound,
	    options: props.keyButton,
	    className: props.keyButton.className || 'text-slate-700',
	});
    }

    if (props.assign && !props.assign.disabled) {
	allActions.push({
	    key: 'assign',
	    label: props.assign.tooltip || 'Assign Asset',
	    icon: props.assign.icon || UserPlus,
	    options: props.assign,
	    className: props.assign.className || 'text-emerald-600',
	});
    }

    if (props.returnAsset && !props.returnAsset.disabled) {
	allActions.push({
	    key: 'returnAsset',
	    label: props.returnAsset.tooltip || 'Return Asset',
	    icon: props.returnAsset.icon || Undo2,
	    options: props.returnAsset,
	    className: props.returnAsset.className || 'text-amber-600',
	});
    }

    if (props.deleteDocument && !props.deleteDocument.disabled) {
	allActions.push({
	    key: 'deleteDocument',
	    label: props.deleteDocument.tooltip || 'Delete Document',
	    icon: props.deleteDocument.icon || FileX,
	    options: props.deleteDocument,
	    className: props.deleteDocument.className || 'text-red-600',
	    isDestructive: true,
	});
    }

    if (props.remove && !props.remove.disabled) {
	allActions.push({
	    key: 'remove',
	    label: props.remove.tooltip || 'Delete Item',
	    icon: props.remove.icon || Trash,
	    options: props.remove,
	    className: props.remove.className || 'text-red-600',
	    isDestructive: true,
	});
    }




    let visibleActions: ActionItem[];
    let dropdownActions: ActionItem[];

    if (allActions.length <= 2) {
	visibleActions = allActions;
	dropdownActions = [];
    } else {
	visibleActions = allActions.slice(0, 2);
	dropdownActions = allActions.slice(2);
    }

    const renderDropdownItemContent = (action: ActionItem) => {
	const Icon = action.icon;
	return (
	    <DropdownMenuItem
		disabled={action.options.disabled}
		className={twMerge(
		    "flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md cursor-pointer transition-colors",
		    action.isDestructive
			? "text-red-600 focus:bg-red-50 focus:text-red-700"
			: "text-slate-700 focus:bg-slate-100 focus:text-slate-900"
		)}
		onClick={(e) => {
		    if (!action.options.alert && !action.options.to && action.options.onClick) {
			action.options.onClick(e);
		    }
		}}
		onSelect={(e) => {
		    if (action.options.alert) {
			e.preventDefault();
		    }
		}}
	    >
		<Icon className={twMerge("w-4 h-4 shrink-0", action.className)}/>
		<span className="truncate">{action.label}</span>
	    </DropdownMenuItem>
	);
    };

    return (
	<div className="flex items-center gap-1">
	    {visibleActions.map((action) => (
		<ActionButton
		    key={action.key}
		    Logo={action.icon}
		    to={action.options.to}
		    onClick={action.options.onClick}
		    tooltip={action.tooltip || action.label}
		    alert={action.options.alert}
		    className={action.className}
		/>
	    ))}

	    {dropdownActions.length > 0 && (
		<DropdownMenu>
		    <ToolTipContainer text="More Actions">
			<DropdownMenuTrigger asChild>
			    <Button
				variant="ghost"
				size="sm"
				className="h-8 w-8 p-0 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
			    >
				<MoreVertical className="w-4 h-4"/>
			    </Button>
			</DropdownMenuTrigger>
		    </ToolTipContainer>
		    <DropdownMenuContent
			align="end"
			className="w-52 p-1.5 space-y-0.5 shadow-xl border border-slate-200/80 bg-white"
		    >
			<DropdownMenuLabel
			    className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1"
			>
			    More Actions
			</DropdownMenuLabel>
			<DropdownMenuSeparator className="my-1 bg-slate-100"/>
			{dropdownActions.map((action) => {
			    const opt = action.options;

			    if (opt.to) {
				return (
				    <Link key={action.key} to={opt.to} className="block">
					{renderDropdownItemContent(action)}
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
					triggerRender={renderDropdownItemContent(action)}
				    />
				);
			    }

			    return <React.Fragment
				key={action.key}>{renderDropdownItemContent(action)}</React.Fragment>;
			})}
		    </DropdownMenuContent>
		</DropdownMenu>
	    )}
	</div>
    );
};