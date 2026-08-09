import type {LucideIcon} from "lucide-react";
import type {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";


interface ICardProps {
    title: string;
    Icon?: LucideIcon;
    iconSize?: number;
    children: ReactNode;
    className?: string;
}

export const DetailCard = ({ title, Icon, iconSize =13,  children, className}: ICardProps) => {
    return (
	<Card className={twMerge("flex flex-col gap-0", className)}>
	    <CardHeader>
		<CardTitle className="">
		    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ptba-primary-navy">
			{Icon && <Icon size={iconSize} />} {title}
		    </span>
		    <Separator className="my-2 bg-slate-100" />
		</CardTitle>
	    </CardHeader>
	    <CardContent className="space-y-2">
		{children}
	    </CardContent>
	</Card>
    );
}


interface IDetailCardItemProps {
    title: string,
    Icon: LucideIcon,
    children?: ReactNode,
    value?: string
}

export const DetailCardItem = ({title: title, Icon, children, value}: IDetailCardItemProps )=> {
    return (
	<div className="flex items-center gap-3">
	    <Icon className="w-4 h-4 text-ptba-gray" />
	    <div>
		<p className="text-xs text-ptba-gray">{title}</p>
		{value ?
		    <p className="text-sm font-medium text-ptba-text">{value}</p> :
		    children}
	    </div>
	</div>
    )
}


interface ICardRowProps {
    label: string;
    value: string;
    className?: string;
}

export const DetailCardRow = ({ label, value, className }: ICardRowProps) => {
    return (
	<div className={twMerge(`flex items-center justify-between text-sm`, className)}>
	    <span className="text-ptba-gray">{label}</span>
	    <span className="font-medium text-ptba-primary-navy">{value}</span>
	</div>
    );
}

