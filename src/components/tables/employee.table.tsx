import {
	type ColumnDef,
	type ColumnFiltersState,
	createColumnHelper,
	getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
	useReactTable
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type { IDetailEmployee } from "@/types/employee.type.ts";
import { DialogContainer } from "@/components/dialog-container.tsx";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { UploadFile } from "@/components/upload-file.tsx";
import { EmployeeRepository } from "@/data/repositories/employee.repository.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Link } from "react-router";
import { getEmployeeStatusStyles } from "@/helper/style-helper.tsx";
import { Badge } from "@/components/ui/badge";
import type { IErrorResponse } from "@/types/api.type.ts";

interface EmployeeTableProps {
	data: IDetailEmployee[];
	isLoading?: boolean;
	onRefresh?: () => void;
}

export const EmployeeTable = ({ data, isLoading = false, onRefresh }: EmployeeTableProps) => {
	const { showNotification } = useNotificationDialog();

	const handleDelete = async (nik: string, name: string) => {
		try {
			await EmployeeRepository.deleteEmployee(nik);
			showNotification({
				variant: 'success',
				title: 'Employee Deleted',
				description: `Employee "${name}" (${nik}) has been deleted successfully.`,
			});
			onRefresh?.();
		} catch (error: any) {
			showNotification({
				variant: 'error',
				title: 'Delete Failed',
				description: error?.message || 'Could not delete employee.',
			});
		}
	};

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
			columnHelper.accessor(row => row.workLocation?.name || '-', {
				header: 'Work Location',
				size: 140,
			}),

			columnHelper.accessor(row => `${row.position || ''} ${row.department || ''}`, {
				header: 'Position',
				size: 350,
				cell: (info) => {
					const employee = info.row.original;
					return (
						<div>
							<div className="font-semibold text-sm">
								{employee.position || '-'}
							</div>
							<div className="text-xs text-gray-500">
								{employee.department || ''}
							</div>
						</div>
					);
				}
			}),
			columnHelper.accessor('religion', {
				header: 'Religion',
				size: 120,
				cell: (info) => info.getValue() ? String(info.getValue()).toUpperCase() : '-'
			}),
			columnHelper.accessor('retireDate', {
				header: 'Retirement Date',
				size: 160,
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
			columnHelper.accessor(row => row.status, {
				id: 'status',
				header: 'Status',
				size: 130,
				cell: (info) => {
					const status = info.getValue();
					let displayLabel = "Unknown";
					if (status === "ON_BA") displayLabel = "ON BA";
					else if (status === "OFF_BA") displayLabel = "OFF BA";
					else if (status) displayLabel = String(status).replace("_", " ");

					const style = getEmployeeStatusStyles(status);
					return (
						<Badge className={`${style.bg} ${style.text} ${style.border} uppercase font-semibold`}>
							{displayLabel}
						</Badge>
					);
				}
			}),
			columnHelper.display({
				id: 'actions',
				header: 'Actions',
				size: 140,
				cell: (info) => {
					const employee = info.row.original;
					return (
						<ActionButtons
							detail={{
								to: `${employee.nik}`,
								tooltip: "Detail Employee"
							}}
							edit={{
								to: `${employee.nik}/update`,
								tooltip: "Edit Employee"
							}}
							remove={{
								tooltip: "Delete Employee",
								dialog: {
									title: "Delete Employee",
									description: `Are you sure you want to delete employee "${employee.name}" (${employee.nik})? This action cannot be undone.`,
									variant: "danger",
									onContinue: () => handleDelete(employee.nik, employee.name),
								}
							}}
						/>
					);
				},
			}),
		],
		[]
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

	const [columnSizing, setColumnSizing] = useState(() => {
		const savedSizes = localStorage.getItem('table-column-sizes-employee');
		return savedSizes ? JSON.parse(savedSizes) : {};
	});

	useEffect(() => {
		localStorage.setItem('table-column-sizes-employee', JSON.stringify(columnSizing));
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
			create={{
				label: "Create New Employee",
				to: "/employees/create",
			}}
			customActions={
				<ExcelUpload onSuccess={onRefresh} />
			}
		/>
	);
}


export const ExcelUpload = ({ onSuccess }: { onSuccess?: () => void }) => {
	const [file, setFile] = useState<File | null>(null);
	const fileRef = useRef<File | null>(null);
	const { showNotification } = useNotificationDialog()
	const handleUpload = async (file: File | null) => {
		if (!file) {
			showNotification({
				variant: "error",
				title: "File must be selected",
				description: "File cannot be empty",
			})
			return
		}

		try {
			await EmployeeRepository.importEmployees(file)
			showNotification({
				variant: "success",
				title: "Employees data has been uploaded",
				description: "Employees data has been uploaded successfully",
			});
			onSuccess?.();
		} catch (e: any) {
			const err = e as IErrorResponse;
			showNotification({
				variant: "error",
				title: "Employees data failed to upload",
				description: err.errors.map(item => item.message).join(", ") || "Failed to upload employees data",
			})
		}
	};

	return (
		<DialogContainer
			triggerRender={
				<Button className="hover:bg-ptba-tertiary-light-green bg-ptba-tertiary-green cursor-pointer">
					<FileDown className="w-4 h-4" data-icon="inline-start" /> Import Employee
				</Button>
			}
			title={"Import Employees Data From Excel"}
			description={""}
			onContinue={() => handleUpload(file!)}
			content={
				<UploadFile fileRef={fileRef} setFile={setFile} label="Employee Excel File" acceptedFileTypes={".xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"} />
			}
		/>
	)
}
