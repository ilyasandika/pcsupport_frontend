import {cn} from "@/lib/utils.ts";

export const SeparatorWithLabel = ({label, className}: {label: string, first?: boolean, className?: string}) => {
    return (
	<div className={cn(`flex items-center gap-2`, className)}>
	    <span className="text-gray-500 whitespace-nowrap">{label}</span>
	    <hr className="w-full"/>
	</div>
    )
}