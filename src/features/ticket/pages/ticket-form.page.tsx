import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldTitle} from "@/components/ui/field.tsx";
import {InputGroupAddon} from "@/components/ui/input-group.tsx";
import {
    Asterisk,
    FileText,
    Info,
    Laptop,
    type LucideIcon,
    MonitorCog,
    TicketIcon,
    User,
    UserRoundCog,
    XIcon
} from "lucide-react";

import {type ChangeEvent, useState} from "react";
import {Textarea} from "@/components/ui/textarea.tsx";
import {useLoaderData, useNavigate} from "react-router";import type {IEmployee} from "@/types/employee.type.ts";
import {Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxList, ComboboxItem} from "@/components/ui/combobox.tsx";
import type {IAsset} from "@/types/asset.type.ts";
import {Item, ItemContent, ItemDescription,  ItemTitle} from "@/components/ui/item.tsx";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type {IDetailUser} from "@/types/user.type.ts";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group.tsx";
import type {ISlaPolicy} from "@/types/sla.type.ts";
import {capitalizeWords, secondsToHMS} from "@/helper/helper.tsx";
import { Button } from "@/components/ui/button";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import type {ICreateTicketDto} from "@/features/ticket/dto/create-ticket.dto.ts";
import {useFormErrors} from "@/hooks/useErrors.tsx";
import type {IErrorResponse} from "@/types/api.type.ts";
import { Spinner } from "@/components/ui/spinner";



export const TicketFormPage = () =>{

    const {employees, assets, engineers, slaPolicies}: {employees: IEmployee[], assets: IAsset[], engineers: IDetailUser[], slaPolicies: ISlaPolicy[]} = useLoaderData()
    const {setErrors, getFieldErrors} = useFormErrors()
    const navigate = useNavigate()

    const [assetList, setAssetList] = useState<IAsset[]>(assets)

    const [problem, setProblem] = useState<string>("")
    const [remarks, setRemarks] = useState<string>("")


    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null)
    // const [disabledEmployee, setDisabledEmployee] = useState<boolean>(false)

    const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null)
    const [disabledAsset, setDisabledAsset] = useState<boolean>(false)
    const [withAsset, setWithAsset] = useState<boolean>(false)

    const [selectedEngineer, setSelectedEngineer] = useState<IDetailUser | null>(null)

    const [selectedSla, setSelectedSla] = useState<ISlaPolicy>(slaPolicies[0])

    const [loading, setLoading] = useState<boolean>(false)

    const getAssetsByEmployeeNik = (nik: string) => {
	const employeeAssets = assets.filter((asset) => asset.assetAssignment?.employee.nik === nik)
	return employeeAssets || null
    }

    const getEmployeeByNik = (nik: string) => {
	const employee = employees.find((emp) => emp.nik === nik)
	return employee || null
    }

    const createTicket = async () => {
	setLoading(true)
	const ticketData: ICreateTicketDto = {
	    assetSn: selectedAsset?.serialNumber,
	    employeeNik: selectedEmployee?.nik,
	    engineerId: selectedEngineer?.id,
	    problem: problem,
	    remarks: remarks,
	    slaPolicyId: selectedSla.id,

	}
	await TicketRepository.createTicket(ticketData).then(() => {
	    navigate("/tickets")
	}).catch((err: IErrorResponse) => {
	    console.log(err)
	    setErrors(err.errors)
	}).finally(() => {
	    setLoading(false)
	})
    }

    return (
	<Card className="pt-0">
	    <CardHeader className="p-0">
		<div className="p-4 bg-primary flex gap-4 items-center">
		    <TicketIcon className="w-8 h-8 text-white"/>
		   <div>
		       <CardTitle className="text-primary-foreground font-bold text-lg">Create New Ticket</CardTitle>
		       <CardDescription className="text-secondary text-sm">Reporting Ticket Form PC Support</CardDescription>
		   </div>
	       </div>
	   </CardHeader>
	    <CardContent>
		<div className="grid grid-cols-1 gap-4">
		    <SeparatorWithLabel label={"Employee & Asset"} first/>
		    <Item variant="muted" className="border border-gray" >
			<ItemContent className="flex gap-3">
			    <div className="flex items-center justify-between">
				<div>
				    <ItemTitle className="flex items-center gap-2">
					<Laptop className="w-4 h-4"/>
					<div className="flex items-start gap-0.5">
					    Asset <Asterisk className="text-ptba-primary-red w-3 h-3"/>
					</div>

				    </ItemTitle>
				</div>
				<div className="flex items-center gap-2">
				    <Switch id="asset" checked={withAsset} onCheckedChange={(checked) => {
					setWithAsset(checked)
					setSelectedAsset(null)
				    }}/>
				    <Label htmlFor="asset" className="font-normal text-sm text-secondary-foreground">
					With Asset
				    </Label>
				</div>
			    </div>

			    {!withAsset &&
                                <Item variant="outline" className="bg-white" size="xs">

                                    <ItemContent>
                                        <div className="flex gap-2 items-center">
                                            <Info className="w-4 h-4 text-ptba-orange"/>
                                            <div>
                                                <ItemTitle>Non Asset Ticket</ItemTitle>
                                                <ItemDescription>
                                                    This ticket is not related to any asset.
                                                </ItemDescription>
                                            </div>
                                        </div>
                                    </ItemContent>
                                </Item>
			    }

			    {withAsset &&
                                <Combobox items={assetList}
                                          itemToStringLabel={(asset: IAsset) => `${asset.assetTag} | ${asset.brand} ${asset.model}`}
                                          itemToStringValue={(asset: IAsset) => `${asset.assetTag} | ${asset.brand} ${asset.model}`}
                                          value={selectedAsset}
                                          autoHighlight
                                          disabled={disabledAsset}
                                >
                                    <ComboboxInput placeholder="" className={"has-disabled:opacity-100 bg-background"} disabled={disabledAsset}>
					{
					    selectedAsset &&
                                            <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={()=> {
						setSelectedAsset(null)
						setDisabledAsset(false)
					    }}>
                                                <XIcon className="w-4 h-4" />
                                            </InputGroupAddon>
					}
                                    </ComboboxInput>
                                    <ComboboxContent>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
					    {(asset: IAsset) => (
						<ComboboxItem
						    key={asset.serialNumber}
						    value={`${asset.assetTag} | ${asset.brand} ${asset.model}`}
						    onClick={()=>{
							setSelectedAsset(asset)
							asset.assetAssignment && setSelectedEmployee(getEmployeeByNik(asset.assetAssignment.employee.nik))
						    }}
						    className={""}
						>
						    <Item size="xs" className="p-0">
							<ItemContent>
							    <ItemTitle>
								{asset.assetTag}
							    </ItemTitle>
							    <ItemDescription>
								{asset.brand} {asset.model}
							    </ItemDescription>
							</ItemContent>
						    </Item>
						</ComboboxItem>
					    )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
			    }
			</ItemContent>
		    </Item>

		    <Field>
			<FieldLabel>
			    <User className="w-4 h-4" />
			    <div className="flex items-start gap-0.5">
				Employee
				<Asterisk className="text-ptba-primary-red w-3 h-3"/>
			    </div>
			</FieldLabel>
			<FieldContent>
			    <Combobox items={employees}
				      itemToStringValue={(emp: IEmployee) => `${emp.nik} | ${emp.name}`}
				      itemToStringLabel={(emp: IEmployee) => `${emp.nik} | ${emp.name}`}
				      value={selectedEmployee}
				      autoHighlight
			    >
				<ComboboxInput placeholder="">
				    {/*<InputGroupAddon align="inline-start">*/}
					{/*<User className="w-4 h-4" />*/}
				    {/*</InputGroupAddon>*/}
				    {selectedEmployee &&
				    <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={()=> {
					setSelectedEmployee(null)
					setSelectedAsset(null)
					setAssetList(assets)
					setDisabledAsset(false)
				    }}>
					<XIcon className="w-4 h-4" />
				    </InputGroupAddon>
				    }
				</ComboboxInput>
				<ComboboxContent>
				    <ComboboxEmpty>No employees found.</ComboboxEmpty>
				    <ComboboxList>
					{(employee: IEmployee) => (
					    <ComboboxItem key={employee.nik} value={`${employee.nik} | ${employee.name}`} onClick={()=> {
						const asset = getAssetsByEmployeeNik(employee.nik)
						setSelectedEmployee(employee)
						setSelectedAsset(null)
						setAssetList(asset)
						setWithAsset(true)
					    }}>
						<Item size="xs" className="p-0">
						    <ItemContent>
							<ItemTitle>
							    {employee.name}
							</ItemTitle>
							<ItemDescription>
							    {employee.nik} | {employee.department}
							</ItemDescription>
						    </ItemContent>
						</Item>
					    </ComboboxItem>
					)}
				    </ComboboxList>
				</ComboboxContent>
			    </Combobox>
			</FieldContent>
			<FieldDescription></FieldDescription>
		    </Field>



		    <SeparatorWithLabel label={"Engineer Information"}/>

		    <Field>
			<FieldLabel>
			    <UserRoundCog className="w-4 h-4" />
			    <div className="flex items-start gap-0.5">
				Engineer
				<Asterisk className="text-ptba-primary-red w-3 h-3"/>
			    </div>
			</FieldLabel>
			<FieldContent>
			    <Combobox items={engineers}
				      itemToStringValue={(eng: IDetailUser) => `${eng.fullName}`}
				      itemToStringLabel={(eng: IDetailUser) => `${eng.fullName}`}
				      value={selectedEngineer}
				      autoHighlight
			    >
				<ComboboxInput placeholder="">
				    {/*<InputGroupAddon align="inline-start">*/}
				    {/*<User className="w-4 h-4" />*/}
				    {/*</InputGroupAddon>*/}
				    {selectedEngineer &&
                                        <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={()=> {
					    setSelectedEngineer(null)

					}}>
                                            <XIcon className="w-4 h-4" />
                                        </InputGroupAddon>
				    }
				</ComboboxInput>
				<ComboboxContent>
				    <ComboboxEmpty>No employees found.</ComboboxEmpty>
				    <ComboboxList>
					{(engineer: IDetailUser) => (
					    <ComboboxItem key={engineer.id} value={`${engineer.fullName}`} onClick={()=> {
						setSelectedEngineer(engineer)
					    }}>
						<Item size="xs" className="p-0">
						    <ItemContent>
							<ItemTitle>
							    {engineer.fullName}
							</ItemTitle>
							<ItemDescription>
							    {engineer.role} | {engineer.workLocation.name}
							</ItemDescription>
						    </ItemContent>
						</Item>
					    </ComboboxItem>
					)}
				    </ComboboxList>
				</ComboboxContent>
			    </Combobox>
			</FieldContent>
			<FieldDescription></FieldDescription>
		    </Field>

		    <SeparatorWithLabel label={"SLA Policy Information"}/>
		    <RadioGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4" defaultValue={`${selectedSla.id}`}>
			{
			    (slaPolicies.length) && slaPolicies.map((sla) => {
				const responseTime = secondsToHMS(sla.responseTimeSeconds)
			    	const resolutionTime = secondsToHMS(sla.resolutionTimeSeconds)

				return (
				    <FieldLabel htmlFor={`${sla.id}`}>
					<Field orientation="horizontal">
					    <RadioGroupItem value={`${sla.id}`} id={`${sla.id}`} onClick={()=>{
						setSelectedSla(sla)
					    }}/>
					    <FieldContent>
						<FieldTitle className="line-clamp-1"><span>{sla.name}</span></FieldTitle>
						<FieldDescription className="line-clamp-2">
						    {sla.description}
						</FieldDescription>
						    <ItemContent className="flex flex-row gap-4 sm:gap-8 border rounded-sm p-2">
							<div className="">
							    <div className="text-xs text-gray-400">
								Response Time
							    </div>
							    <div className="">
								{`${responseTime.hours}h ${responseTime.minutes}m`}
							    </div>
							</div>
							<div className="">
							    <div className="text-xs text-gray-400">
								Resolution Time
							    </div>
							    <div className="text-">
								{`${resolutionTime.hours}h ${resolutionTime.minutes}m`}
							    </div>
							</div>
						    </ItemContent>
					    </FieldContent>
					</Field>
				    </FieldLabel>
				)
			    })
			}
		    </RadioGroup>


		    <SeparatorWithLabel label={"Case Information"}/>
		    <TextAreaField
			label="Problem"
			required
			Icon={MonitorCog}
			value={problem}
			onChange={(e) => setProblem(e.target.value)}
			errors={getFieldErrors("problem")}
		    />
		    <TextAreaField
			label="Remarks"
			Icon={FileText}
			value={remarks}
			onChange={(e) => setRemarks(e.target.value)}
			errors={getFieldErrors("remarks")}
		    />
		</div>
	    </CardContent>
	    <CardFooter className="flex justify-end w-full">
		<Button variant="default"
			onClick={() => {
			    setLoading(true)
			    createTicket()
			}}
			className="cursor-pointer"
			disabled={loading}
		>
		    {loading && <Spinner data-icon="inline-start"/>}
		    Create Ticket
		</Button>
	    </CardFooter>
	</Card>
    )
}

// interface InputWithIconProps {
//     label: string;
//     placeholder?: string;
//     value: string;
//     onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
//     description?: string;
//     disabled?: boolean;
// }
//
// const InputWithChecklist = ({label, placeholder, description, value, onChange, disabled = false}: InputWithIconProps) => {
//     return (
// 	<Field>
// 	    <FieldLabel>{label}</FieldLabel>
// 	    <InputGroup>
// 		<InputGroupInput type="text" placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}/>
// 		<InputGroupAddon align="inline-start">
// 		    <Check className="w-4 h-4" />
// 		</InputGroupAddon>
// 	    </InputGroup>
// 	    <FieldDescription>{description}</FieldDescription>
// 	</Field>
//     )
// }


//
// interface DropdownProps {
//     label: string;
//     description?: string;
//     items: { label: string; value: string }[];
//     disabled?: boolean;
// }
//
// const Dropdown = ({label, items, description, disabled=false}: DropdownProps) => {
//     return (
// 	<Field>
// 	    <FieldLabel>{label}</FieldLabel>
// 	    <Select defaultValue="apple" disabled={disabled}>
// 		<SelectTrigger className="w-full max-w-48">
// 		    <SelectValue />
// 		</SelectTrigger>
// 		<SelectContent position="popper">
// 		    <SelectGroup>
// 			<SelectLabel>Fruits</SelectLabel>
// 			{items.map((item) => (
// 			    <SelectItem key={item.value} value={item.value}>
// 				{item.label}
// 			    </SelectItem>
// 			))}
// 		    </SelectGroup>
// 		</SelectContent>
// 	    </Select>
// 	    <FieldDescription>{description}</FieldDescription>
// 	</Field>
//     )
// }


interface TextareaFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    description?: string;
    errors?: string[];
    required?: boolean;
    Icon: LucideIcon
}


const TextAreaField = ({value, onChange, label, description, placeholder, errors, required = false, Icon}: TextareaFieldProps) => {
    return (
	<Field>
	    <FieldLabel htmlFor={label}>
		<Icon className="w-4 h-4"/>
		<div className="flex items-start gap-0.5">
		    {label}
		    {required && <Asterisk className="text-ptba-primary-red w-3 h-3"/>}
		</div>
	    </FieldLabel>
	    <Textarea id={label} value={value} onChange={onChange} placeholder={placeholder}/>
	    <FieldDescription>{description}</FieldDescription>
	    {
		errors?.length && errors.map((error) => (
		    <FieldError>
			{capitalizeWords(error, "only first")}
		    </FieldError>
		))
	    }
	</Field>
    )
}

const SeparatorWithLabel = ({label, first = false}: {label: string, first?: boolean}) => {
    return (
	<div className={`flex items-center gap-2 ${!first && "mt-4"}`}>
	    <span className="text-gray-500 whitespace-nowrap">{label}</span>
	    <hr className="w-full"/>
	</div>
    )
}
//
// const LocationField = ({label, description, onCheckedChange, disabled = false}: {label: string, description: string, onCheckedChange?(checked: boolean): void, disabled?: boolean}) => {
//     return (
// 	<FieldLabel>
// 	    <Field orientation="horizontal">
// 		<Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" onCheckedChange={onCheckedChange} disabled={disabled}/>
// 		<FieldContent>
// 		    <FieldTitle>{label}</FieldTitle>
// 		    <FieldDescription>
// 			{description}
// 		    </FieldDescription>
// 		</FieldContent>
// 	    </Field>
// 	</FieldLabel>
//     )
// }
//
