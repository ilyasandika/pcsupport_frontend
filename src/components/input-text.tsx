import { Input } from "@/components/ui/input";
import type { ChangeEvent } from "react";
import { FieldInputWrapper, type IFieldInputWrapper } from "@/components/field-input-wrapper.tsx";


interface IInputTextProps extends IFieldInputWrapper {
	placeholder?: string,
	id: string,
	value?: string,
	type?: string,
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
	disabled?: boolean,
	required?: boolean,
}

export const InputText = ({ required = false, label, type, id, placeholder, Icon, value, onChange, errors, disabled = false }: IInputTextProps) => {
	return (
		<FieldInputWrapper Icon={Icon} label={label} errors={errors} required={required}>
			<Input
				id={id}
				placeholder={placeholder}
				type={type}
				aria-label={label}
				value={value}
				onChange={onChange}
				disabled={disabled}
				required={required}
				className="placeholder:italic"
			/>
		</FieldInputWrapper>
	)
}



