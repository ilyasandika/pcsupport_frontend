import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/input-text.tsx";
import { CalendarDays, FileText, Phone, Wrench, UserCog } from "lucide-react";
import { useFormErrors } from "@/hooks/use-errors.tsx";
import { InputSelect } from "@/components/input-select.tsx";
import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { IErrorResponse } from "@/types/api.type.ts";
import { useAuth } from "@/context/AuthContext.tsx";
import type { ITicket } from "@/types/ticket.type.ts";
import type { IDetailAssetAssignment } from "@/types/asset-assignment.type.ts";
import { AssetAssignmentRepository } from "@/data/repositories/asset-assignment.repository.ts";
import {getLocalDatetime} from "@/helper/helper.tsx";

interface GeneratePdfDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: ITicket | IDetailAssetAssignment;
    type?: 'assign' | 'return';
}
const isTicketData = (item: ITicket | IDetailAssetAssignment): item is ITicket => {
    return 'engineer' in item;
};

export const GeneratePdfDialog = ({
				      open,
				      onOpenChange,
				      data,
				      type = "assign"
				  }: GeneratePdfDialogProps) => {
    const { setErrors, getFieldErrors } = useFormErrors()
    const { isAdmin } = useAuth()

    const [phoneNumber, setPhoneNumber] = useState("")
    const [engineerId, setEngineerId] = useState<string>("")
    const [supervisorId, setSupervisorId] = useState<string>("")

    const handleCloseDialog = () => {
	onOpenChange(false);
    }

    const { data: engineers = [] } = useQuery({
	queryKey: ["engineers"],
	queryFn: UserRepository.getUsers,
	enabled: open,
    })

    const { data: supervisors = [] } = useQuery({
	queryKey: ["supervisors"],
	queryFn: UserRepository.getSupervisors,
	enabled: open,
    })

    const engineerOptions = engineers.map((engineer) => ({
	label: engineer.fullName,
	value: String(engineer.id),
    }))

    const supervisorOptions = supervisors.map((supervisor) => ({
	label: supervisor.fullName,
	value: String(supervisor.id),
    }))

    useEffect(() => {
	if (!engineerId && data) {
	    if (isTicketData(data)) {
		setEngineerId(String(data.engineer?.id ?? ""));
	    } else {
		setEngineerId(String(data.assignBy?.id ?? ""));
	    }
	}
    }, [engineers, data, engineerId]);

    useEffect(() => {
	if (!supervisorId && supervisors.length > 0) {
	    setSupervisorId(String(supervisors[0].id))
	}
    }, [supervisors, supervisorId]);

    const generateMutation = useMutation({
	mutationFn: () => {
	    const payload = {
		phoneNumber: phoneNumber || undefined,
		engineerId: Number(engineerId),
		supervisorId: Number(supervisorId),
	    };
	    if (isTicketData(data)) {
		return TicketRepository.generateTicketPdf(data.id, payload);
	    } else {
		return AssetAssignmentRepository.generateDocument(data.id, payload, type);
	    }
	},
	onError: (error: IErrorResponse) => {
	    setErrors(error.errors)
	},
	onSuccess: () => {
	    onOpenChange(false);
	},
    })

    const handleGenerate = () => {
	generateMutation.mutate()
    }

    const dialogTitle = isTicketData(data) ? "Generate Ticket PDF" : "Generate Assignment PDF";

    return (
	<Dialog open={open} onOpenChange={onOpenChange}>
	    <DialogTrigger />
	    <DialogContent>
		<DialogHeader>
		    <DialogTitle>{dialogTitle}</DialogTitle>
		    <DialogDescription>
			Complete these data to create the PDF document.
		    </DialogDescription>
		</DialogHeader>
		<div className="flex flex-col gap-4 py-2">
		    {/*<InputText*/}
			{/*label="Phone Number"*/}
			{/*id="phoneNumber"*/}
			{/*Icon={Phone}*/}
			{/*value={phoneNumber}*/}
			{/*onChange={(e) => setPhoneNumber(e.target.value)}*/}
			{/*errors={getFieldErrors("phoneNumber")}*/}
		    {/*/>*/}
		    {/*{isAdmin() && (*/}
			{/*<InputSelect*/}
			{/*    label="Engineer"*/}
			{/*    Icon={Wrench}*/}
			{/*    items={engineerOptions}*/}
			{/*    value={engineerId}*/}
			{/*    onChange={setEngineerId}*/}
			{/*    errors={getFieldErrors("engineerId")}*/}
			{/*/>*/}
		    {/*)}*/}
		    <InputSelect
			label="Supervisor"
			Icon={UserCog}
			items={supervisorOptions}
			value={supervisorId}
			onChange={setSupervisorId}
			errors={getFieldErrors("supervisorId")}
		    />
		    {/*<InputText*/}
			{/*label="Date"*/}
			{/*id="date"*/}
			{/*Icon={CalendarDays}*/}
			{/*type="datetime-local"*/}
			{/*value={date}*/}
			{/*onChange={(e) => setDate(e.target.value)}*/}
			{/*errors={getFieldErrors("date")}*/}
		    {/*/>*/}
		</div>

		<DialogFooter>
		    <Button variant="outline" onClick={handleCloseDialog} disabled={generateMutation.isPending}>
			Cancel
		    </Button>
		    <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
			<FileText className="size-4 mr-1.5" />
			{generateMutation.isPending ? "Loading..." : "Generate PDF"}
		    </Button>
		</DialogFooter>
	    </DialogContent>
	</Dialog>
    )
}