import type {LucideIcon} from "lucide-react";
import type {ReactNode} from "react";


interface ICardProps {
    title: string;
    Icon?: LucideIcon;
    iconSize?: number;
    children: ReactNode;
}

export const DetailCard = ({ title, Icon, iconSize =13,  children}: ICardProps) => {
    return (
	<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
	    <h2 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
		{Icon && <Icon size={iconSize} />} {title}
	    </h2>
	    {children}
	</div>
    );
}

