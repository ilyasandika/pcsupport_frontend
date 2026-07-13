import type {LucideIcon} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import type {MouseEventHandler} from "react";

interface IExpandableButtonProps {
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
    className?: string;
    Icon: LucideIcon;
    value: string
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}
export const ExpandableButton = (
    {
	variant = "default",
	Icon,
	value,
	disabled = false,
	onClick,
    }: IExpandableButtonProps) => {
    return (
	<Button variant={variant} className="cursor-pointer group transition" onClick={onClick} disabled={disabled}>
	    <Icon data-icon="inline-start"/>
	    <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-37.5 group-hover:opacity-100 group-hover:ml-2">
		    	{value}
		</span>
	</Button>
    )
}