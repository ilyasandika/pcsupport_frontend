import {Field, FieldDescription, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import type {ChangeEvent, RefObject} from "react";


export const UploadFile = ({label = "File", description, setFile, fileRef, acceptedFileTypes}: {
    label?: string,
    description?: string,
    fileRef: RefObject<File | null>,
    setFile: (file: File | null) => void,
    acceptedFileTypes?: string,
}) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
	if (e.target.files && e.target.files.length > 0) {
	    const selectedFile = e.target.files[0];
	    setFile(selectedFile);
	    fileRef.current = selectedFile;
	}
    };
    return (
	<Field>
	    <FieldLabel htmlFor="file">{label}</FieldLabel>
	    <Input id="file" type="file" aria-label="file" onChange={handleFileChange} accept={acceptedFileTypes}/>
	    <FieldDescription>{description}</FieldDescription>
	</Field>
    )
}