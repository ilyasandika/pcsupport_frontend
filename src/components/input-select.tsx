import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {FieldInputWrapper, type IFieldInputWrapper} from "@/components/field-input-wrapper.tsx";
import type {ReactNode} from "react";


interface IInputSelectProps<T> extends IFieldInputWrapper {
    value: T | any,
    items: {
	label: string,
	value: T | any
    }[],
    onChange: (value: T | any) => void,
    content?: (value: T | any) => ReactNode
    required?: boolean,
    disabled?: boolean,
}

export const InputSelect = <T,>({items, disabled = false, Icon, label, value, content, onChange, required=false, ...props}: IInputSelectProps<T>) => {
    return (
	<FieldInputWrapper Icon={Icon} label={label} errors={props.errors} required={required}>
	    <Select defaultValue={value} value={value} onValueChange={onChange} disabled={disabled}>
		<SelectTrigger className="w-full">
		    <SelectValue />
		</SelectTrigger>
		<SelectContent>
		    <SelectGroup>
			<SelectLabel></SelectLabel>
			{
			    items.map((item) => (
				<SelectItem key={item.value} value={item.value}>
				    {
					content ? content(item) : item.label
				    }
				</SelectItem>
			    ))
			}
		    </SelectGroup>
		</SelectContent>
	    </Select>
	</FieldInputWrapper>
    )
}