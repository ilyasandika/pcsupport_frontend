import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router";
import {ArrowRight} from "lucide-react";
import type {ReactNode} from "react";

interface DashboardCardWrapperProps {
    title: string;
    to: string;
    children: ReactNode;
    className?: string;
}

export const DashboardCardWrapper = ({title, to, className, children }: DashboardCardWrapperProps) => {

    return (
	<Card className={cn("w-full gap-0", className)}>
	    <CardHeader className="flex flex-row items-center justify-between border-b mb-0">
		<CardTitle>
		    {title}
		</CardTitle>
		<Link to={to} className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
		    See more
		    <ArrowRight className="h-3.5 w-3.5" />
		</Link>
	    </CardHeader>
	    <CardContent className="p-0">
		{children}
	    </CardContent>
   	 </Card>
    )
};