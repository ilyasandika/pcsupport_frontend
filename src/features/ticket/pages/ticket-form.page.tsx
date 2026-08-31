import {
	Asterisk, CheckCircle, Clock4,
	FileText,
	Info,
	Laptop, LaptopMinimalCheck,
	MonitorCog,
	UserRoundCog,
	BriefcaseBusiness, Phone, ShieldAlert, MapPin, Calendar
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router";
import type { IEmployee } from "@/types/employee.type.ts";
import type { IAsset } from "@/types/asset.type.ts";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item.tsx";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { IDetailUser, IUser } from "@/types/user.type.ts";
import type { ISlaPolicy } from "@/types/sla.type.ts";
import type { IWorkLocation } from "@/types/work-location.type.ts";
import { getLocalDatetime, isTicketSolved, secondsToHMS } from "@/helper/helper.tsx";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import { AssetRepository } from "@/data/repositories/asset.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import type { IErrorResponse } from "@/types/api.type.ts";
import { type ICreateTicketPayload, type ITicket, type IUpdateTicketPayload, TicketStatus } from "@/types/ticket.type.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import { TextAreaField } from "@/components/textarea-field.tsx";
import { SeparatorWithLabel } from "@/components/separator-with-label.tsx";
import { FormWrapper } from "@/components/form-wrapper.tsx";
import { EntityCombobox } from "@/components/entity-combobox.tsx";
import { InputSelect } from "@/components/input-select.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator";
import { getPriorityStyles } from "@/helper/style-helper.tsx";
import { cn } from "@/lib/utils.ts";
import { useMutation } from "@tanstack/react-query";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { InputText } from "@/components/input-text.tsx";
import { FieldInputWrapper } from "@/components/field-input-wrapper.tsx";
import { useResourceAccess } from "@/hooks/use-resource-access.ts";

interface ITicketFormLoader {
	employees: IEmployee[],
	assets: IAsset[],
	engineers: IDetailUser[],
	slaPolicies: ISlaPolicy[]
	ticket?: ITicket
}

export const TicketFormPage = () => {
	const { employees, assets, engineers, slaPolicies, ticket }: ITicketFormLoader = useLoaderData()
	const { setErrors, getFieldErrors, generalErrors } = useFormErrors()
	const { isAdmin, isHelpdesk, isEngineer, user } = useAuth()
	const { canAccess } = useResourceAccess()

	const [initialValue, _] = useState<ITicket | null>(ticket || null)

	const isUpdate = !!initialValue;
	const navigate = useNavigate()

	const { showNotification } = useNotificationDialog()

	const isAllowedToAccess = useMemo(() => {
		if (!isUpdate || !initialValue) return true;
		return canAccess({
			resourceOwnerId: initialValue.engineer?.id,
			bypassRoles: ["admin", "helpdesk"],
		});
	}, [isUpdate, initialValue, canAccess]);

	useEffect(() => {
		if (isUpdate && initialValue && !isAllowedToAccess) {
			showNotification({
				variant: "error",
				title: "Access Denied",
				description: "You do not have permission to edit this ticket.",
				onClose: () => navigate(-1),
			});
		}
	}, [isUpdate, initialValue, isAllowedToAccess, navigate, showNotification]);

	if (isUpdate && !isAllowedToAccess) {
		return null;
	}

	const [assetList, setAssetList] = useState<IAsset[]>(assets)

	const [problem, setProblem] = useState<string>(initialValue?.problem ?? "")
	const [remarks, setRemarks] = useState<string>(initialValue?.remarks ?? "")
	const [solution, setSolution] = useState<string>(initialValue?.solution || "")
	const [contact, setContact] = useState<string>(initialValue?.contact || "")

	const [startAt, setStartAt] = useState<string>(initialValue?.startAt ? getLocalDatetime(initialValue.startAt) : "")
	const [solvedAt, setSolvedAt] = useState<string>(initialValue?.solvedAt ? getLocalDatetime(initialValue.solvedAt) : "")

	const [selectedStatus, setSelectedStatus] = useState<string>(initialValue?.status || "open")
	const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(initialValue?.employee || null)
	const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(initialValue?.asset || null)
	const [selectedEngineer, setSelectedEngineer] = useState<IUser | null>(initialValue?.engineer || null)
	const [selectedSla, setSelectedSla] = useState<ISlaPolicy>(() => {
		if (initialValue?.slaPolicy) {
			return slaPolicies.find((sla) => sla.id === initialValue.slaPolicy.id) || slaPolicies[0]
		}
		return slaPolicies.find(sla => sla.isDefault) || slaPolicies[0]
	})


	useEffect(() => {
		console.log(selectedEmployee)
	}, [selectedEmployee])
	const [disabledAsset, setDisabledAsset] = useState<boolean>(false)

	const [withAsset, setWithAsset] = useState<boolean>(!!initialValue?.asset)

	const derivedLocation = useMemo<IWorkLocation | null>(() => {
		// 1. If employee selected, take employee's default location
		if (selectedEmployee?.workLocation) {
			return selectedEmployee.workLocation;
		}
		// 2. If asset selected, take asset's location
		if (selectedAsset?.workLocation) {
			return selectedAsset.workLocation;
		}
		// 3. Fallback: Engineer location (selected engineer or logged in user)
		if (selectedEngineer?.workLocation) {
			return selectedEngineer.workLocation;
		}
		const currentEngineerDetail = engineers.find(
			(e) => e.id === (selectedEngineer?.id || user?.sub)
		);
		if (currentEngineerDetail?.workLocation) {
			return currentEngineerDetail.workLocation;
		}
		if (initialValue?.location) {
			return initialValue.location;
		}
		return null;
	}, [selectedEmployee, selectedAsset, selectedEngineer, engineers, user, initialValue]);


	const getEmployeeByNik = (nik?: string | null) => {
		if (!nik) return null
		const employee = employees.find((emp) => String(emp.nik).trim() === String(nik).trim())
		return employee || null
	}


	const ticketStatus = Object.values(TicketStatus).map((status) => ({ label: status, value: status }))

	const slaItems = slaPolicies.map((sla) => (
		{
			label: sla.name,
			value: sla
		}
	))

	const slaStyle = getPriorityStyles[selectedSla.priority]

	const createTicketMutation = useMutation({
		mutationFn: (payload: ICreateTicketPayload) => TicketRepository.createTicket(payload),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "Ticket successfully created",
				description: "New ticket has been created.",
				onClose: () => navigate("/tickets"),
			})
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors)
		}
	})

	const updateTicketMutation = useMutation({
		mutationFn: ({ id, payload }: { id: number, payload: IUpdateTicketPayload }) => TicketRepository.updateTicket(id, payload),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "Ticket Successfully Updated",
				description: "Ticket has been updated successfully.",
				onClose: () => navigate("/tickets"),
			})
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors)
		}
	})

	const saveTicket = async () => {
		if (initialValue) {
			const ticketData: IUpdateTicketPayload = {
				status: selectedStatus,
				assetTag: selectedAsset?.assetTag,
				employeeNik: selectedEmployee?.nik,
				engineerId: isAdmin() ? selectedEngineer?.id : user?.sub,
				solution: solution,
				problem: problem,
				remarks: remarks,
				locationId: derivedLocation?.id,
				slaPolicyId: selectedSla.id,
				startAt: (isAdmin() && startAt) ? new Date(startAt).toISOString() : initialValue.startAt,
				solvedAt: isAdmin()
					? (solvedAt ? new Date(solvedAt).toISOString() : null)
					: (!isTicketSolved(selectedStatus) ? null : initialValue.solvedAt),
				contact: contact
			}
			updateTicketMutation.mutate({ id: initialValue.id, payload: ticketData })
		} else {
			const ticketData: ICreateTicketPayload = {
				assetTag: selectedAsset?.assetTag,
				employeeNik: selectedEmployee?.nik,
				engineerId: isAdmin() ? selectedEngineer?.id : user?.sub,
				problem: problem,
				remarks: remarks,
				locationId: derivedLocation?.id,
				slaPolicyId: selectedSla.id,
				contact: contact
			}
			createTicketMutation.mutate(ticketData)
		}
	}

	return (
		<FormWrapper
			label={"Ticket"}
			description={"Ticket Form PC Support"}
			variant={initialValue ? "update" : "create"}
			action={saveTicket}>
			<div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
				{
					generalErrors &&
					<Item>
						<ItemContent>
							{
								generalErrors.map((error) => (
									<p className={"text-danger"}>{error}</p>
								))
							}
						</ItemContent>
					</Item>
				}
				{
					(!isUpdate || isAdmin() || isHelpdesk()) &&
					<Card>
						<CardContent className="flex flex-col gap-4">
							<SeparatorWithLabel label={"Employee & Asset"} className="" />
							<Item variant="muted" className="border border-gray" >
								<ItemContent className="flex gap-3">
									<div className="flex items-center justify-between">
										<div>
											<ItemTitle className="flex items-center gap-2">
												<Laptop className="w-4 h-4" />
												<div className="flex items-start gap-0.5">
													Asset <Asterisk className="text-ptba-primary-red w-3 h-3" />
												</div>

											</ItemTitle>
										</div>
										<div className="flex items-center gap-2">
											<Switch id="asset" checked={withAsset} onCheckedChange={(checked) => {
												setWithAsset(checked)
												setSelectedAsset(null)
											}} />
											<Label htmlFor="asset" className="font-normal text-sm text-secondary-foreground">
												With Asset
											</Label>
										</div>
									</div>

									{!withAsset &&
										<Item variant="outline" className="bg-white" size="xs">
											<ItemContent>
												<div className="flex gap-2 items-center">
													<Info className="w-4 h-4 text-ptba-orange" />
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
										<EntityCombobox<IAsset>
											items={assetList}
											value={selectedAsset}
											getLabel={(a: IAsset) => `${a.assetTag} | ${a.type}`}
											disabled={disabledAsset}
											getKey={(a: IAsset) => a.serialNumber}
											getSearchValue={(a: IAsset) => `${a.assetTag} | ${a.type}`}
											getTitle={(a: IAsset) => a.assetTag}
											getDescription={(a: IAsset) => `${a.type}`}
											onSelect={(asset) => {
												setSelectedAsset(asset)
												const assignedNik = asset.assetAssignment?.employee?.nik
												if (assignedNik) {
													const emp = getEmployeeByNik(assignedNik) || asset.assetAssignment?.employee
													if (emp) {
														setSelectedEmployee(emp)
													}
												}
											}}
											onClear={() => {
												setSelectedAsset(null)
												setDisabledAsset(false)
											}}
										/>
									}
								</ItemContent>
							</Item>

							{/*employee combobox*/}
							<FieldInputWrapper Icon={UserRoundCog} label={"User / Employee"} errors={getFieldErrors("employeeNik")}>
								<EntityCombobox<IEmployee>
									items={employees}
									value={selectedEmployee}
									getKey={(e) => e.nik}
									getLabel={(e) => `${e.nik} | ${e.name}`}
									getSearchValue={(e) => `${e.nik} | ${e.name}`}
									getTitle={(e) => e.name}
									getDescription={(e) => `${e.nik} | ${e.department}`}
									onSelect={async (employee) => {
										setSelectedEmployee(employee)
										setSelectedAsset(null)
										try {
											const empAssets = await AssetRepository.getAssetsByEmployeeNik(employee.nik)
											setAssetList(empAssets)
										} catch {
											setAssetList([])
										}
									}}
									onClear={() => {
										setSelectedEmployee(null)
										setSelectedAsset(null)
										setAssetList(assets)
									}}
								/>
							</FieldInputWrapper>

							<InputText id={"location"}
								Icon={MapPin}
								label={"Location"}
								value={derivedLocation ? derivedLocation.name : "-"}
								disabled={true}
							/>

							<InputText id={"contact"}
								Icon={Phone}
								label={"Contact"}
								value={contact}
								onChange={(e) => setContact(e.target.value)}

							/>
						</CardContent>
					</Card>
				}

				<Card>
					<CardContent>
						<SeparatorWithLabel label={"Case Information"} className="mb-4" />
						<div className="flex flex-wrap gap-4">
							<TextAreaField
								label="Problem"
								required
								Icon={MonitorCog}
								value={problem}
								onChange={(e) => setProblem(e.target.value)}
								errors={getFieldErrors("problem")}
								className="flex-1"
							/>
							{
								isUpdate &&
								<TextAreaField
									label="Solution"
									Icon={LaptopMinimalCheck}
									value={solution}
									onChange={(e) => setSolution(e.target.value)}
									errors={getFieldErrors("solution")}
									className="flex-1"
								/>
							}
							<TextAreaField
								label="Remarks"
								Icon={FileText}
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
								errors={getFieldErrors("remarks")}
								className={isUpdate ? "w-full" : "flex-1"}

							/>
						</div>
					</CardContent>
				</Card>

				{
					(isUpdate && isAdmin()) &&
					<Card>
						<CardContent className="flex flex-col gap-4">
							<SeparatorWithLabel label={"Ticket Timestamps (Admin Only)"} />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<InputText
									id={"startAt"}
									Icon={Calendar}
									type="datetime-local"
									label={"Start At"}
									value={startAt}
									onChange={(e) => setStartAt(e.target.value)}
									errors={getFieldErrors("startAt")}
								/>
								<InputText
									id={"solvedAt"}
									Icon={Calendar}
									type="datetime-local"
									label={"Solved At"}
									value={solvedAt}
									onChange={(e) => setSolvedAt(e.target.value)}
									disabled={!isTicketSolved(selectedStatus)}
									errors={getFieldErrors("solvedAt")}
								/>
							</div>
						</CardContent>
					</Card>
				}

				{
					(!isTicketSolved(selectedStatus) || !isEngineer()) &&
					<Card>
						<CardContent className="flex flex-col gap-4">
							<SeparatorWithLabel label={"SLA Policy Information"} />
							<div>
								<InputSelect<ISlaPolicy> value={selectedSla}
									items={slaItems}
									onChange={(val) => setSelectedSla(val)}
									Icon={ShieldAlert}
									content={(value) => {

										return (
											<div
												className="flex flex-row items-center justify-between w-full">
												<span>{value.value.name} -</span>
												<span
													className={`font-bold uppercase rounded-lg p-1`}>{value.value.priority}</span>
											</div>
										)
									}}
									label={"Sla Policy"}
								/>
								{selectedSla &&
									<Card className={cn("mb-1", slaStyle.bg)}>
										<CardContent>
											<span
												className={cn("font-medium", slaStyle.text)}>{selectedSla.description}</span>
											<Separator className="my-1" />
											<div className="flex flex-row gap-4  text-xs">
												<div className="flex items-center gap-2">

													<span className="flex flex-row items-center gap-1">
														<Clock4 className="w-3" />
														Response:
													</span>
													<span className="font-light">
														{`
															${secondsToHMS(selectedSla.responseTimeSeconds).hours}h 
															${secondsToHMS(selectedSla.responseTimeSeconds).minutes}m
														`}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="flex flex-row items-center gap-1">
														<CheckCircle className="w-3" />
														Resolution:
													</span>
													<span className="font-light">
														{`
															${secondsToHMS(selectedSla.resolutionTimeSeconds).hours}h 
															${secondsToHMS(selectedSla.resolutionTimeSeconds).minutes}m
														`}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<span className="flex flex-row items-center gap-1">
														<BriefcaseBusiness className="w-3" />
														Service:
													</span>
													<span className="font-light">
														{selectedSla.isBusinessHourOnly ? "Business Hours Only" : "24/7"}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								}
							</div>
						</CardContent>
					</Card>
				}

				{
					(isAdmin() || isHelpdesk()) &&
					<Card>
						<CardContent className="flex flex-col gap-4">
							<SeparatorWithLabel label={"Engineer Information"} />
							<FieldInputWrapper Icon={UserRoundCog} label={"Engineer"}>
								<EntityCombobox<IUser>
									items={engineers}
									value={selectedEngineer}
									getKey={(e) => e.id}
									getLabel={(e) => e.fullName}
									getSearchValue={(e) => e.fullName}
									getTitle={(e) => e.fullName}
									getDescription={(e) => `${e.role} | ${e.workLocation.name}`}
									onSelect={setSelectedEngineer}
									onClear={() => setSelectedEngineer(null)}
								/>
							</FieldInputWrapper>

							{
								(isUpdate && !isEngineer()) &&
								<>
									<InputSelect value={selectedStatus}
										items={ticketStatus}
										onChange={(value) => setSelectedStatus(value)}
										Icon={Info}
										label={"Status"} />

								</>
							}
						</CardContent>
					</Card>
				}
			</div>
		</FormWrapper>

	)
}

