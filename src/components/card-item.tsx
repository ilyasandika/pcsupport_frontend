import type {LucideIcon} from "lucide-react";
import type {ReactNode} from "react";

export const CardItem = ({title: title, Icon, children, value}: {title: string, Icon: LucideIcon, children?: ReactNode, value?: string} )=> {
    return (
	<div className="flex items-center gap-3">
	    <Icon className="w-4 h-4 text-gray-400 mt-1" />
	    <div>
		<p className="text-xs text-gray-400 font-medium">{title}</p>
		{value ?
		    <p className="text-sm font-semibold text-ptba-text">{value}</p> :
		    children}
	    </div>
	</div>

    )
}