import {Download, Eye, FileText, Info, type LucideIcon, SquarePen, Trash} from "lucide-react";
import React from "react";
import {twMerge} from "tailwind-merge";


const ActionButton = ({Logo, onClick, className}: ActionButtonProps) => {
    return (
	<button
	    onClick={onClick}
	    className={twMerge('`text-xs text-ptba-primary  font-semibold hover:underline cursor-pointer', className)}
	>
	    <Logo className='w-4'/>
	</button>
    )
}

interface ActionButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    Logo: LucideIcon;
    className?: string;
}

interface ActionButtonsProps {
    edit?: ActionButtonsOptions;
    info?: ActionButtonsOptions;
    remove?: ActionButtonsOptions;
    detail?: ActionButtonsOptions;
    download?: ActionButtonsOptions;
    document?: ActionButtonsOptions
}

interface ActionButtonsOptions {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const ActionButtons = ({edit, info, detail, download, remove, document}: ActionButtonsProps) => {
    return (
	<div className='flex gap-2'>
	    {edit && 		<ActionButton Logo={SquarePen}  onClick={edit.onClick}	/>}
	    {info && 		<ActionButton Logo={Info}  	onClick={info.onClick}		className='text-ptba-common'/>}
	    {detail && 		<ActionButton Logo={Eye}  	onClick={detail.onClick}	className='text-ptba-yellow'/>}
	    {download && 	<ActionButton Logo={Download}  	onClick={download.onClick}	className='text-ptba-green'/>}
	    {document && 	<ActionButton Logo={FileText}  	onClick={document.onClick}	className='text-ptba-green'/>}
	    {remove && 		<ActionButton Logo={Trash}  	onClick={remove.onClick}	className='text-ptba-red'/>}
	</div>
    )
}