import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useEffect, useMemo, useRef, useState} from "react";
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type { IDetailEmployee } from "@/types/employee.type.ts";
import {AlertDialogContainer} from "@/components/alert-dialog-container.tsx";
import { Button } from "@/components/ui/button";
import {FileDown} from "lucide-react";
import {UploadFile} from "@/components/upload-file.tsx";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Link} from "react-router";
import {getEmployeeStatusStyles} from "@/helper/style-helper.tsx";
import { Badge } from "@/components/ui/badge";

interface EmployeeTableProps {
    data: IDetailEmployee[]
    isLoading?: boolean
}

export const EmployeeTable = ({ data, isLoading = false }: EmployeeTableProps) => {
    const columnHelper = createColumnHelper<IDetailEmployee>();
    const columns: ColumnDef<IDetailEmployee, any>[] = useMemo(
	() => [
	    columnHelper.accessor(row => `${row.name} ${row.nik}`, {
		header: 'Name / NIK',
		size: 250,
		cell: (info) => {
		    const employee = info.row.original;
		    return (
			<Link to={`/employees/${employee.nik}`}>
			    <div className="font-semibold">
				{employee.name}
			    </div>
			    <div className="text-xs text-gray-500">
				{`NIK: ${employee.nik || '-'}`}
			    </div>
			</Link>
		    );
		}
	    }),
	    columnHelper.accessor(row => row.workLocation.name, {
		header: 'Work Location',
		size: 120,
	    }),

	    columnHelper.accessor(row => `${row.position} ${row.department}`, {
		header: 'Position',
		size: 400,
		cell: (info) => {
		    const employee = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-sm">
				{employee.position}
			    </div>
			    <div className="text-xs text-gray-500">
				{employee.department}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('religion', {
		header: 'Religion',
		size: 150,
		cell: (info) => info.getValue() ? info.getValue().toUpperCase() : '-'
	    }),
	    columnHelper.accessor('retireDate', {
		header: 'Retirement Date',
		size: 180,
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    return new Date(rawValue).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		    });
		}
	    }),
	    columnHelper.accessor(row => {
		return row.status ? row.status : "unknown"
	    }, {
		header: 'Status',
		size: 150,
		cell: (info) => {
		    const status = info.getValue();
		    const style = getEmployeeStatusStyles(status)
		    return (
			<Badge className={`${style.bg} ${style.text} ${style.border} uppercase`}>
			    {status ? status : "unknown"}
			</Badge>
		    );
		}
	    }),
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		size: 120,
		cell: (info) => (
		    <ActionButtons
			detail={{
			    to: `${info.row.original.nik}`,
			    tooltip: "Detail"
			}}
		    />
		),
	    }),
	],
	[]
    );

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const [columnSizing, setColumnSizing] = useState(() => {
	const savedSizes = localStorage.getItem('table-column-sizes');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IDetailEmployee>({
	data,
	columns,
	state: {
	    columnFilters,
	    pagination,
	    columnSizing
	},
	renderFallbackValue: '-',
	onColumnFiltersChange: setColumnFilters,
	onPaginationChange: setPagination,
	columnResizeMode: 'onChange',
	onColumnSizingChange: setColumnSizing,
	getCoreRowModel: getCoreRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

    return (
	<DataTable
	    table={table}
	    name='All Employees'
	    isLoading={isLoading}
	    customActions={
	    	<ExcelUpload/>
	    }
	/>)
}


export const ExcelUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<File | null>(null);
    const {showNotification} = useNotificationDialog()
    const handleUpload = async (file: File | null) => {
	if (!file) {
	    showNotification({
		variant: "error",
		title: "File must be selected",
		description: "File cannot be empty",
		onClose: () => window.location.reload(),
	    })
	    return
	}

	try{
	    await EmployeeRepository.importEmployees(file)
	    showNotification({
		variant: "success",
		title: "Employees data has been uploaded",
		description: "Employees data has been uploaded successfully",
		onClose: () => window.location.reload(),
	    })
	} catch (e: Error | any) {
	    showNotification({
		variant: "error",
		title: "Employees data failed to upload",
		description: e.message || "Failed to upload employees data",
		onClose: () => window.location.reload(),
	    })
	}
    };

    return (
	<AlertDialogContainer
	    triggerRender={
		<Button className="hover:bg-ptba-tertiary-light-green bg-ptba-tertiary-green cursor-pointer">
		    <FileDown className="w-4 h-4" data-icon="inline-start"/> Import Employee
		</Button>
	    }
	    title={"Import Employees Data From Excel"}
	    description={""}
	    onContinue={()=> handleUpload(file!)}
	    content={
	    	<UploadFile fileRef={fileRef} setFile={setFile} label="Employee Excel File" acceptedFileTypes={".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} />
	    }
	/>
    )
}