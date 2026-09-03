import {
	Asterisk,
	FileText,
	Hash,
	Info,
	Link2,
	MonitorCog,
	Building2,
	CalendarClock,
	CalendarCheck2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";

import type { ITicket } from "@/types/ticket.type.ts";
import type { IVendor } from "@/types/vendor.type.ts";
import type {
	IExternalTicket,
	IExternalTicketPayload,
} from "@/types/external-ticket.type.ts";
import type { IErrorResponse } from "@/types/api.type.ts";

import { ExternalTicketRepository } from "@/data/repositories/external-ticket.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";

import { Item, ItemContent } from "@/components/ui/item.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { FormWrapper } from "@/components/form-wrapper.tsx";
import { SeparatorWithLabel } from "@/components/separator-with-label.tsx";
import { FieldInputWrapper } from "@/components/field-input-wrapper.tsx";
import { EntityCombobox } from "@/components/entity-combobox.tsx";
import { InputText } from "@/components/input-text.tsx";
import { InputSelect } from "@/components/input-select.tsx";
import { TextAreaField } from "@/components/textarea-field.tsx";

interface IExternalTicketFormLoader {
	tickets: ITicket[];
	vendors: IVendor[];
	externalTicket?: IExternalTicket;
}

const EXTERNAL_TICKET_STATUS = [
	{ label: "In Progress", value: "in progress" },
	{ label: "Closed", value: "closed" },
	{ label: "Cancelled", value: "cancelled" },
];

export const ExternalTicketFormPage = () => {
	const { tickets = [], vendors = [], externalTicket }: IExternalTicketFormLoader =
		useLoaderData();
	const [searchParams] = useSearchParams();
	const { setErrors, getFieldErrors, generalErrors } = useFormErrors();
	const navigate = useNavigate();
	const { showNotification } = useNotificationDialog();

	const [initialValue] = useState<IExternalTicket | null>(
		externalTicket || null
	);

	const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(
		initialValue?.ticket || null
	);
	const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(
		initialValue?.vendor || null
	);
	const [ticketFullNumber, setTicketFullNumber] = useState<string>(
		initialValue?.ticketFullNumber ?? ""
	);
	const [caseNumber, setCaseNumber] = useState<string>(
		initialValue?.caseNumber ?? ""
	);
	const [problem, setProblem] = useState<string>(
		initialValue?.problem ?? ""
	);
	const [resolution, setResolution] = useState<string>(
		initialValue?.resolution ?? ""
	);
	const [status, setStatus] = useState<string>(
		initialValue?.status ?? "in progress"
	);
	const [escalatedDate, setEscalatedDate] = useState<string>(
		initialValue?.escalatedDate ? String(initialValue.escalatedDate).slice(0, 10) : new Date().toISOString().slice(0, 10)
	);
	const [resolvedDate, setResolvedDate] = useState<string>(
		initialValue?.resolvedDate ? String(initialValue.resolvedDate).slice(0, 10) : ""
	);

	// Auto-select ticket from URL query params (e.g. ?ticketId=123&ticketFullNumber=TCK-123)
	useEffect(() => {
		if (!selectedTicket && tickets.length > 0) {
			const urlTicketId = searchParams.get("ticketId");
			const urlTicketFullNumber = searchParams.get("ticketFullNumber");

			if (urlTicketId || urlTicketFullNumber) {
				const matched = tickets.find(
					(t) =>
						String(t.id) === urlTicketId ||
						(urlTicketFullNumber && t.fullNumber === urlTicketFullNumber)
				);
				if (matched) {
					setSelectedTicket(matched);
					setTicketFullNumber(matched.fullNumber || "");
					if (!problem) setProblem(matched.problem || "");
				}
			}
		}
	}, [tickets, searchParams]);

	// Handle ticket selection change
	const handleSelectTicket = (t: ITicket | null) => {
		setSelectedTicket(t);
		if (t) {
			setTicketFullNumber(t.fullNumber || "");
			if (!problem) setProblem(t.problem || "");
		} else {
			setTicketFullNumber("");
		}
	};

	// Prioritize or filter tickets that need backup
	const ticketOptions = useMemo(() => {
		if (!tickets || tickets.length === 0) return [];
		const needBackupTickets = tickets.filter(t => Boolean(t.backupAssetTag || (t as any).backUpAsset || (t as any).isNeedBackup));
		return needBackupTickets.length > 0 ? needBackupTickets : tickets;
	}, [tickets]);

	const createMutation = useMutation({
		mutationFn: (payload: IExternalTicketPayload) =>
			ExternalTicketRepository.create(payload),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "External Ticket successfully created",
				description: "New external ticket has been created.",
				onClose: () => navigate("/external-tickets"),
			});
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: number;
			payload: IExternalTicketPayload;
		}) => ExternalTicketRepository.update(id, payload),
		onSuccess: () => {
			showNotification({
				variant: "success",
				title: "External Ticket Successfully Updated",
				description: "External ticket has been updated successfully.",
				onClose: () => navigate("/external-tickets"),
			});
		},
		onError: (err: IErrorResponse) => {
			setErrors(err.errors);
		},
	});

	const saveExternalTicket = async () => {
		if (!selectedTicket && !ticketFullNumber.trim()) {
			setErrors([
				{
					field: "ticketFullNumber",
					message: ["You must select or specify an Internal Ticket Number"],
				},
			]);
			return;
		}
		if (!selectedVendor) {
			setErrors([
				{
					field: "vendorId",
					message: ["You must select a Vendor"],
				},
			]);
			return;
		}
		if (!caseNumber.trim()) {
			setErrors([
				{
					field: "caseNumber",
					message: ["Case Number cannot be empty"],
				},
			]);
			return;
		}

		const payload: IExternalTicketPayload = {
			ticketFullNumber: ticketFullNumber.trim() || selectedTicket?.fullNumber || "",
			ticketId: selectedTicket?.id,
			vendorId: selectedVendor.id,
			caseNumber: caseNumber.trim(),
			problem: problem.trim(),
			resolution: resolution.trim() || undefined,
			status,
			escalatedDate: escalatedDate ? new Date(escalatedDate).toISOString() : new Date().toISOString(),
			resolvedDate: resolvedDate ? new Date(resolvedDate).toISOString() : undefined,
		};

		if (initialValue) {
			updateMutation.mutate({ id: initialValue.id, payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	return (
		<FormWrapper
			label={"External Ticket"}
			description={"External Ticket Form (Vendor Escalation)"}
			variant={initialValue ? "update" : "create"}
			action={saveExternalTicket}
		>
			<div className="grid grid-cols-1 xl:grid-cols-1 gap-4">
				{generalErrors && (
					<Item>
						<ItemContent>
							{generalErrors.map((error, idx) => (
								<p key={idx} className={"text-danger"}>{error}</p>
							))}
						</ItemContent>
					</Item>
				)}

				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label={"Reference"} />

						<FieldInputWrapper
							Icon={Link2}
							label={"Internal Ticket (Need Backup)"}
							errors={getFieldErrors("ticketFullNumber") || getFieldErrors("ticketId")}
						>
							<EntityCombobox<ITicket>
								items={ticketOptions}
								value={selectedTicket}
								getKey={(t) => t.id}
								getLabel={(t) => `${t.fullNumber || t.id} | ${t.problem} ${(t.backupAssetTag || (t as any).backUpAsset) ? ' (Need Backup)' : ''}`}
								getSearchValue={(t) => `${t.fullNumber || t.id} | ${t.problem}`}
								getTitle={(t) => `${t.fullNumber || `Ticket #${t.id}`}`}
								getDescription={(t) => `${t.problem} ${(t.backupAssetTag || (t as any).backUpAsset) ? ' • Backup Attached' : ''}`}
								onSelect={handleSelectTicket}
								onClear={() => handleSelectTicket(null)}
							/>
						</FieldInputWrapper>

						<FieldInputWrapper
							Icon={Building2}
							label={"Vendor"}
							errors={getFieldErrors("vendorId")}
						>
							<EntityCombobox<IVendor>
								items={vendors}
								value={selectedVendor}
								getKey={(v) => v.id}
								getLabel={(v) => v.name}
								getSearchValue={(v) => v.name}
								getTitle={(v) => v.name}
								getDescription={(v) => v.contacts && v.contacts.length > 0 ? v.contacts.map(c => `${c.type}: ${c.value}`).join(" | ") : ""}
								onSelect={setSelectedVendor}
								onClear={() => setSelectedVendor(null)}
							/>
						</FieldInputWrapper>

						<div className="flex flex-wrap gap-4">
							<InputText
								id={"ticketFullNumber"}
								Icon={Hash}
								label={"Ticket Full Number"}
								value={ticketFullNumber}
								onChange={(e) =>
									setTicketFullNumber(e.target.value)
								}
								errors={getFieldErrors("ticketFullNumber")}
								disabled
							/>
							<InputText
								id={"caseNumber"}
								Icon={Hash}
								label={"Case Number / SR No."}
								value={caseNumber}
								onChange={(e) => setCaseNumber(e.target.value)}
								errors={getFieldErrors("caseNumber")}
							/>
						</div>
					</CardContent>
				</Card>

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
							<TextAreaField
								label="Resolution"
								Icon={FileText}
								value={resolution}
								onChange={(e) => setResolution(e.target.value)}
								errors={getFieldErrors("resolution")}
								className="flex-1"
							/>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex flex-col gap-4">
						<SeparatorWithLabel label={"Status & Timeline"} />

						<InputSelect
							value={status}
							items={EXTERNAL_TICKET_STATUS}
							onChange={(value) => setStatus(value)}
							Icon={Info}
							label={"Status"}
						/>

						<div className="flex flex-wrap gap-4">
							<InputText
								id={"escalatedDate"}
								type="date"
								Icon={CalendarClock}
								label={"Escalated Date"}
								value={escalatedDate}
								onChange={(e) => setEscalatedDate(e.target.value)}
								errors={getFieldErrors("escalatedDate")}
								className="flex-1"
							/>
							<InputText
								id={"resolvedDate"}
								type="date"
								Icon={CalendarCheck2}
								label={"Resolved Date"}
								value={resolvedDate}
								onChange={(e) => setResolvedDate(e.target.value)}
								errors={getFieldErrors("resolvedDate")}
								className="flex-1"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</FormWrapper>
	);
};