import {
    CircleCheck,
    Download,
    Eye, FileSearch,
    FileText,
    FileUp,
    Info, KeyRound,
    type LucideIcon,
    SquarePen,
    Trash,
    UserPlus,
    Undo2,
} from "lucide-react";
import React, {type ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {Link} from "react-router";
import { Button } from "@/components/ui/button";
import { Tooltip , TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {AlertDialogContainer} from "@/components/alert-dialog-container.tsx";

const ToolTipContainer = ({children, text}: {
    children: ReactNode
    text?: string
}) => {
    return (
	<Tooltip>
	    <TooltipTrigger>
		{children}
	    </TooltipTrigger>
	    <TooltipContent>
		{text}
	    </TooltipContent>
	</Tooltip>
    )
}

interface ActionButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    Logo: LucideIcon;
    to?: string;
    className?: string;
    tooltip?: string;
    alert?: {
	title: string;
	description: string;
	variant?:  "success" | "danger" | "warning" | "info";
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
		    className={twMerge('`text-xs text-ptba-primary  font-semibold hover:underline cursor-pointer', className)}
		>
		    <Logo className='w-4'/>
		</Link>
	    )
	}
    }

    const ButtonComp = () => {
	return (
	    <Button
		variant="link"
		onClick={onClick}
		className={twMerge('p-0 cursor-pointer', className)}
	    >
		<Logo className='w-4'/>
	    </Button>
	)
    }

    if (to) {
	return (
	    <ToolTipContainer text={tooltip}>
		{
		    alert ?
			<AlertDialogContainer
			    triggerRender={<LinkComp/>}
			    title={alert.title}
			    description={alert.description}
			    content={alert.content}
			    onContinue={alert.onContinue}
			    variant={alert.variant}
			    icon={alert.icon}
			/>
			:
			<LinkComp/>
		}
	    </ToolTipContainer>
	)
    } else {
	return (
	    <ToolTipContainer text={tooltip}>
		{
		    alert ?
			<AlertDialogContainer
			    triggerRender={<ButtonComp/>}
			    title={alert.title}
			    content={alert.content}
			    description={alert.description}
			    onContinue={alert.onContinue}
			    variant={alert.variant}
			    icon={alert.icon}
			/>
			:
			<ButtonComp/>
		}

	    </ToolTipContainer>
	)
    }
}



interface ActionButtonsOptions {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    to?: string;
    disabled?: boolean;
    tooltip?: string;
    alert?: {
	title: string;
	description: string;
	content?: ReactNode;
	variant?:  "success" | "danger" | "warning" | "info";
	onContinue?: () => void;
	icon?: ReactNode;
    };
}

interface ActionButtonsProps {
    edit?: ActionButtonsOptions;
    info?: ActionButtonsOptions;
    remove?: ActionButtonsOptions;
    detail?: ActionButtonsOptions;
    download?: ActionButtonsOptions;
    generateDocument?: ActionButtonsOptions
    check?: ActionButtonsOptions;
    seeDocument?: ActionButtonsOptions;
    uploadDocument?: ActionButtonsOptions;
    keyButton?: ActionButtonsOptions;
    assign?: ActionButtonsOptions;
    returnAsset?: ActionButtonsOptions;
}

export const ActionButtons = ({edit, info, detail, download, remove, generateDocument, check, seeDocument, uploadDocument, keyButton, assign, returnAsset}: ActionButtonsProps) => {
    return (
	<div className='flex gap-2 items-center'>
	    {(edit && !edit.disabled) && 				<ActionButton Logo={SquarePen}  	to={edit.to}  			onClick={edit.onClick}			tooltip={edit.tooltip} 			alert={edit.alert}     			/>}
	    {(info && !info.disabled) && 				<ActionButton Logo={Info}  		to={info.to}  			onClick={info.onClick}			tooltip={info.tooltip} 			alert={info.alert}      		className='text-ptba-primary-navy'/>}
	    {(detail && !detail.disabled) && 				<ActionButton Logo={Eye}  		to={detail.to}  		onClick={detail.onClick}		tooltip={detail.tooltip} 		alert={detail.alert}     		className='text-ptba-secondary-orange'/>}
	    {(download && !download.disabled) && 			<ActionButton Logo={Download}  		to={download.to}  		onClick={download.onClick}		tooltip={download.tooltip} 		alert={download.alert}     		className='text-ptba-tertiary-green'/>}
	    {(remove && !remove.disabled) && 				<ActionButton Logo={Trash}  		to={remove.to}  		onClick={remove.onClick}		tooltip={remove.tooltip} 		alert={remove.alert}     		className='text-danger'/>}
	    {(check && !check.disabled) && 				<ActionButton Logo={CircleCheck}	to={check.to}  			onClick={check.onClick}			tooltip={check.tooltip} 		alert={check.alert}     		className='text-ptba-tertiary-green'/>}
	    {(generateDocument && !generateDocument.disabled) && 	<ActionButton Logo={FileText}		to={generateDocument.to} 	onClick={generateDocument.onClick} 	tooltip={generateDocument.tooltip} 	alert={generateDocument.alert}    	className='text-ptba-tertiary-green'/>}
	    {(uploadDocument && !uploadDocument.disabled) &&		<ActionButton Logo={FileUp}  		to={uploadDocument.to} 		onClick={uploadDocument.onClick}	tooltip={uploadDocument.tooltip} 	alert={uploadDocument.alert}    	className='text-ptba-tertiary-green'/>}
	    {(seeDocument && !seeDocument.disabled) &&			<ActionButton Logo={FileSearch}  	to={seeDocument.to}  		onClick={seeDocument.onClick}		tooltip={seeDocument.tooltip} 		alert={seeDocument.alert}    		className='text-ptba-tertiary-green'/> }
	    {(keyButton && !keyButton.disabled) &&					<ActionButton Logo={KeyRound} to={keyButton.to} onClick={keyButton.onClick} tooltip={keyButton.tooltip} alert={keyButton.alert} className='text-ptba-primary-navy'/> }
	    {(assign && !assign.disabled) && 				<ActionButton Logo={UserPlus}  	to={assign.to}  		onClick={assign.onClick}		tooltip={assign.tooltip} 		alert={assign.alert}     		className='text-ptba-tertiary-green'/>}
	    {(returnAsset && !returnAsset.disabled) && 			<ActionButton Logo={Undo2}  		to={returnAsset.to}  		onClick={returnAsset.onClick}		tooltip={returnAsset.tooltip} 		alert={returnAsset.alert}     		className='text-ptba-secondary-orange'/>}
	</div>
    )
}