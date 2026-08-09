import { Badge } from "@/components/ui/badge";


export const BadgeStatus = ({label, variant = "info"}: {
    label: string,
    variant?: "success" | "danger" | "warning" | "info",
}) => {

    const variantStyle = {
	danger: "bg-ptba-primary-red/10 text-ptba-primary-red",
	warning: "bg-ptba-primary-yellow/10 text-ptba-primary-yellow",
	info: "bg-ptba-tertiary-light-blue/10 text-ptba-tertiary-light-blue",
	success: "bg-ptba-tertiary-green/10 text-ptba-tertiary-green",
    }

    const currentStyle = variantStyle[variant];

    return (
	<Badge className={`${currentStyle} uppercase rounded-md`}>
	    {label}
	</Badge>
    )
}