import type {MouseEventHandler} from "react";
import type {LucideIcon} from "lucide-react";


interface ITabButtonProps  {
    active: boolean;
    onClick: MouseEventHandler<HTMLButtonElement>;
    Icon: LucideIcon;
    label: string;
    count: number;
}



export const TabButton = ({ active, onClick, Icon, label, count }: ITabButtonProps) => {
    return (
	<button
	    onClick={onClick}
	    className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors ${
		active ? "text-ptba-text" : "text-slate-400 hover:text-slate-600"
	    }`}
	>
	    <Icon size={15} />
	    {label}
	    <span
		className={`rounded-full px-2 py-0.5  text-[11px] ${
		    active ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
		}`}
	    >
		{count}
	    </span>
	    {active && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-slate-900" />}
	</button>
    );
}