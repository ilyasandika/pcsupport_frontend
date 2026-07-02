import type {ReactNode} from "react";

export const TimelineWrap = ({ children }: {children: ReactNode}) => {
    return (
	<div className="relative space-y-6 pl-6">
	    <div className="absolute bottom-1 left-1.25 top-1 w-px bg-slate-200" />
	    {children}
	</div>
    );
}