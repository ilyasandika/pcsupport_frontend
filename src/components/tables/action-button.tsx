import {Download, Eye, FileText, Info, type LucideIcon, SquarePen, Trash} from "lucide-react";
import React from "react";
import {twMerge} from "tailwind-merge";
import {Link} from "react-router";
import { Button } from "@/components/ui/button";


const ActionButton = ({Logo, onClick, className, to}: ActionButtonProps) => {
    if (to) {
	return (
	    <Link
		to={to}
		className={twMerge('`text-xs text-ptba-primary  font-semibold hover:underline cursor-pointer', className)}
	    >
		<Logo className='w-4'/>
	    </Link>
	)
    } else {
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
}

interface ActionButtonProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    Logo: LucideIcon;
    to?: string;
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
    to?: string;
}

export const ActionButtons = ({edit, info, detail, download, remove, document}: ActionButtonsProps) => {
    return (
	<div className='flex gap-2 items-center'>
	    {edit && 		<ActionButton Logo={SquarePen}  to={edit.to}  onClick={edit.onClick}			/>}
	    {info && 		<ActionButton Logo={Info}  	to={info.to}  onClick={info.onClick}		className='text-ptba-primary-navy'/>}
	    {detail && 		<ActionButton Logo={Eye}  	to={detail.to}  onClick={detail.onClick}	className='text-ptba-secondary-orange'/>}
	    {download && 	<ActionButton Logo={Download}  	to={download.to}  onClick={download.onClick}	className='text-ptba-tertiary-green'/>}
	    {document && 	<ActionButton Logo={FileText}  	to={document.to}  onClick={document.onClick}	className='text-ptba-tertiary-green'/>}
	    {remove && 		<ActionButton Logo={Trash}  	to={remove.to}  onClick={remove.onClick}	className='text-danger'/>}
	</div>
    )
}