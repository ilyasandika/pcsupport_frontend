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


interface IInputSelectProps extends IFieldInputWrapper {
    value: string,
    items: {
	label: string,
	value: string
    }[],
    onChange: (value: string) => void,
}

export const InputSelect = ({items, Icon, label, value, onChange, ...props}: IInputSelectProps) => {
    return (
	<FieldInputWrapper Icon={Icon} label={label} errors={props.errors}>
	    <Select defaultValue={value} value={value} onValueChange={onChange}>
		<SelectTrigger className="w-full">
		    <SelectValue />
		</SelectTrigger>
		<SelectContent>
		    <SelectGroup>
			<SelectLabel></SelectLabel>
			{
			    items.map((item) => (
				<SelectItem key={item.value} value={item.value}>
				    {item.label}
				</SelectItem>
			    ))
			}
		    </SelectGroup>
		</SelectContent>
	    </Select>
	</FieldInputWrapper>
    )
}