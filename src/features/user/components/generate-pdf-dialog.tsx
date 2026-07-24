import {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {InputText} from "@/components/input-text.tsx";
import {CalendarDays, FileText,  Phone, Wrench, UserCog} from "lucide-react";
import {useFormErrors} from "@/hooks/useErrors.tsx";
import {InputSelect} from "@/components/input-select.tsx";
import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {useQuery, useMutation} from "@tanstack/react-query";
import type {ITicket} from "@/types/ticket.type.ts";
import type {IErrorResponse} from "@/types/api.type.ts";

interface GenerateTicketPdfDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ticket: ITicket;
}

export const GenerateTicketPdfDialog = ({
					    open,
					    onOpenChange,
					    ticket,
					}: GenerateTicketPdfDialogProps) => {
    const {setErrors, getFieldErrors} = useFormErrors()

    const [phoneNumber, setPhoneNumber] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [engineerId, setEngineerId] = useState<string>("")
    const [supervisorId, setSupervisorId] = useState<string>("")

    const {data: engineers = []} = useQuery({
	queryKey: ["engineers"],
	queryFn: UserRepository.getUsers,
	enabled: open,
    })

    const {data: supervisors = []} = useQuery({
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
	if (!engineerId && ticket.engineer?.id) {
	    setEngineerId(String(ticket.engineer.id))
	}
    }, [engineers])

    useEffect(() => {
	if (!supervisorId && supervisors.length > 0) {
	    setSupervisorId(String(supervisors[0].id))
	}
    }, [supervisors])

    const generateMutation = useMutation({
	mutationFn: () => {
	    return TicketRepository.generateTicketPdf(ticket.id, {
		phoneNumber: phoneNumber || undefined,
		engineerId: Number(engineerId),
		supervisorId: Number(supervisorId),
		date,
	    });
	},
	onError: (error: IErrorResponse) => {
	    setErrors(error.errors)
	},
	onSuccess: () => {
	    onOpenChange(false)
	},
    })

    const handleGenerate = () => {
	generateMutation.mutate()
    }

    return (
	<Dialog open={open} onOpenChange={onOpenChange}>
	    <DialogTrigger/>
	    <DialogContent>
		<DialogHeader>
		    <DialogTitle>Generate Ticket</DialogTitle>
		    <DialogDescription>
			Complete these data to create PDF.
		    </DialogDescription>
		</DialogHeader>
		<div className="flex flex-col gap-4 py-2">
		    <InputText
			label="Phone Number"
			id="phoneNumber"
			Icon={Phone}
			value={phoneNumber}
			onChange={(e) => setPhoneNumber(e.target.value)}
			errors={getFieldErrors("phoneNumber")}
		    />
		    <InputSelect
			label="Engineer"
			Icon={Wrench}
			items={engineerOptions}
			value={engineerId}
			onChange={setEngineerId}
			errors={getFieldErrors("engineerId")}
		    />
		    <InputSelect
			label="Supervisor"
			Icon={UserCog}
			items={supervisorOptions}
			value={supervisorId}
			onChange={setSupervisorId}
			errors={getFieldErrors("supervisorId")}
		    />
		    <InputText
			label="Date"
			id="date"
			Icon={CalendarDays}
			type="date"
			value={date}
			onChange={(e) => setDate(e.target.value)}
			errors={getFieldErrors("date")}
		    />
		</div>

		<DialogFooter>
		    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={generateMutation.isPending}>
			Cancel
		    </Button>
		    <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
			<FileText className="size-4 mr-1.5"/>
			{generateMutation.isPending ? "Loading the document ..." : "Generate PDF"}
		    </Button>
		</DialogFooter>
	    </DialogContent>
	</Dialog>
    )
}