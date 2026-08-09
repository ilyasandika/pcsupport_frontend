import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"


interface ICheckboxBasicProps {
    id? : string,
    value: boolean,
    onChange: (checked: boolean) => void,
    label: string,
}

export const CheckboxBasic = ({id, value, onChange, label}: ICheckboxBasicProps) => {
    return (
	<FieldGroup className="">
	    <Field orientation="horizontal">
		<Checkbox id={id} name={id} checked={value} onCheckedChange={onChange}/>
		<FieldLabel htmlFor="terms-checkbox-basic">
		    {label}
		</FieldLabel>
	    </Field>
	</FieldGroup>
    )
}
