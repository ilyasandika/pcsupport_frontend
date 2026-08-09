import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon,
    InputGroupButton,
} from "@/components/ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ChevronDownIcon, type LucideIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {FieldInputWrapper} from "@/components/field-input-wrapper.tsx";

export type CapacityUnit = "KB" | "MB" | "GB";

const UNIT_FACTOR: Record<CapacityUnit, number> = {
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
};

const UNITS: CapacityUnit[] = ["KB", "MB", "GB"];

interface InputCapacityProps {
    label: string;
    id: string;
    Icon: LucideIcon;
    value?: number;
    onChange: (bytes: number | undefined) => void;
    defaultUnit?: CapacityUnit;
    errors?: string[];
    required?: boolean;
}

export const InputCapacity = ({
				  label,
				  id,
				  Icon,
				  value,
				  onChange,
				  defaultUnit = "GB",
				  errors,
				  required = false,
			      }: InputCapacityProps) => {
    const [unit, setUnit] = useState<CapacityUnit>(defaultUnit);
    const [displayValue, setDisplayValue] = useState<string>(
	value !== undefined && value !== null
	    ? String(value / UNIT_FACTOR[defaultUnit])
	    : ""
    );

    useEffect(() => {
	if (value !== undefined && value !== null) {
	    setDisplayValue(String(value / UNIT_FACTOR[unit]));
	} else {
	    setDisplayValue("");
	}
    }, [value]);

    const handleValueChange = (raw: string) => {
	setDisplayValue(raw);
	if (raw === "") {
	    onChange(undefined);
	    return;
	}
	const parsed = Number(raw);
	if (Number.isNaN(parsed)) return;
	onChange(Math.round(parsed * UNIT_FACTOR[unit]));
    };

    const handleUnitChange = (newUnit: CapacityUnit) => {
	if (newUnit === unit) return;
	if (displayValue !== "" && !Number.isNaN(Number(displayValue))) {
	    const bytes = Number(displayValue) * UNIT_FACTOR[unit];
	    setDisplayValue(String(bytes / UNIT_FACTOR[newUnit]));
	}
	setUnit(newUnit);
    };

    return (
	<FieldInputWrapper Icon={Icon} label={label} errors={errors} required={required}>
	    <InputGroup>
		<InputGroupInput
		    id={id}
		    type="number"
		    min={0}
		    placeholder="0"
		    value={displayValue}
		    onChange={(e) => handleValueChange(e.target.value)}
		/>
		<InputGroupAddon align="inline-end">
		    <DropdownMenu>
			<DropdownMenuTrigger asChild>
			    <InputGroupButton variant="ghost" className="pr-1.5! text-xs">
				{unit} <ChevronDownIcon className="size-3"/>
			    </InputGroupButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={8} alignOffset={-4}>
			    <DropdownMenuGroup>
				{UNITS.map((u) => (
				    <DropdownMenuItem key={u} onSelect={() => handleUnitChange(u)}>
					{u}
				    </DropdownMenuItem>
				))}
			    </DropdownMenuGroup>
			</DropdownMenuContent>
		    </DropdownMenu>
		</InputGroupAddon>
	    </InputGroup>
	</FieldInputWrapper>

    );
};