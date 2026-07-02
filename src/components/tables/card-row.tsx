
interface ISpecRowProps {
    label: string;
    value: string;
    last?: boolean;
}

export const CardRow = ({ label, value, last }: ISpecRowProps) => {
    return (
	<div className={`flex items-center justify-between py-1.5 text-sm ${last ? "" : "border-b border-dashed border-slate-100"}`}>
	    <span className="text-slate-500">{label}</span>
	    <span className="font-medium text-slate-800">{value}</span>
	</div>
    );
}