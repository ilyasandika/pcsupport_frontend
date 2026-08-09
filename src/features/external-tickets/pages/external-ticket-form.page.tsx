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
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import type { ITicket } from "@/types/ticket.type.ts";
import type { IVendor } from "@/types/vendor.type.ts";
import type {
    IExternalTicket,
    IExternalTicketPayload,
} from "@/types/external-ticket.type.ts";
import type { IErrorResponse } from "@/types/api.type.ts";

import { ExternalTicketRepository } from "@/data/repositories/external-ticket.repository.ts";
import { useFormErrors } from "@/hooks/use-errors.tsx";
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
    { label: "Open", value: "open" },
    { label: "Escalated", value: "escalated" },
    { label: "In Progress", value: "in_progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
];

export const ExternalTicketFormPage = () => {
    const { tickets, vendors, externalTicket }: IExternalTicketFormLoader =
	useLoaderData();
    const { setErrors, getFieldErrors, generalErrors } = useFormErrors();
    const navigate = useNavigate();
    const { showNotification } = useNotificationDialog();

    const [initialValue] = useState<IExternalTicket | null>(
	externalTicket || null
    );
    const isUpdate = !!initialValue;

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
	initialValue?.status ?? "open"
    );
    const [escalatedDate, setEscalatedDate] = useState<string>(
	initialValue?.escalatedDate?.slice(0, 10) ?? ""
    );
    const [resolvedDate, setResolvedDate] = useState<string>(
	initialValue?.resolvedDate?.slice(0, 10) ?? ""
    );

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
	if (!selectedTicket) {
	    setErrors([
		{
		    field: "ticketId",
		    message: ["You must select an Internal Ticket"],
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

	const payload: IExternalTicketPayload = {
	    ticketId: selectedTicket.id,
	    vendorId: selectedVendor.id,
	    caseNumber,
	    problem,
	    resolution,
	    status,
	    escalatedDate: escalatedDate || undefined,
	    resolvedDate: resolvedDate || undefined,
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
			    {generalErrors.map((error) => (
				<p className={"text-danger"}>{error}</p>
			    ))}
			</ItemContent>
		    </Item>
		)}

		<Card>
		    <CardContent className="flex flex-col gap-4">
			<SeparatorWithLabel label={"Reference"} />

			<FieldInputWrapper
			    Icon={Link2}
			    label={"Internal Ticket"}
			    errors={getFieldErrors("ticketId")}
			>
			    <EntityCombobox<ITicket>
				items={tickets}
				value={selectedTicket}
				getKey={(t) => t.id}
				getLabel={(t) => `${t.ticketNumber} | ${t.problem}`}
				getSearchValue={(t) =>
				    `${t.ticketNumber} | ${t.problem}`
				}
				getTitle={(t) => t.ticketNumber}
				getDescription={(t) => t.problem}
				onSelect={setSelectedTicket}
				onClear={() => setSelectedTicket(null)}
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
				getDescription={(v) => v.email ?? ""}
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
				className="flex-1"
			    />
			    <InputText
				id={"caseNumber"}
				Icon={Hash}
				label={"Case Number"}
				value={caseNumber}
				onChange={(e) => setCaseNumber(e.target.value)}
				errors={getFieldErrors("caseNumber")}
				className="flex-1"
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