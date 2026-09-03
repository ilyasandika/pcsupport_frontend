import {
	type ColumnDef,
	type ColumnFiltersState,
	createColumnHelper,
	getCoreRowModel,
	useReactTable
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import { AssetStatus, type IAsset } from "@/types/asset.type.ts";
import { Badge } from "@/components/ui/badge";
import { getAssetStatusStyles } from "@/helper/style-helper.tsx";
import { cn } from "@/lib/utils.ts";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value.ts";
import { columnFiltersToParams } from "@/helper/helper.tsx";
import { AssetRepository } from "@/data/repositories/asset.repository.ts";

interface AssetTableProps {
	// data: IAsset[]
	isLoading?: boolean
}

export const AssetTable = ({ isLoading = false }: AssetTableProps) => {
	const columnHelper = createColumnHelper<IAsset>();
	const columns: ColumnDef<IAsset, any>[] = useMemo(
		() => [
			columnHelper.display({
				id: 'actions',
				header: 'Actions',

				cell: (info) => {
					const id = info.row.original.assetTag
					return (
						<ActionButtons
							detail={{
								to: `${id}`,
								tooltip: "Detail Asset"
							}}
							edit={{
								to: `${`${id}/update`}`,
								tooltip: "Edit Asset"
							}}
						// remove={{
						// to: `${'#'}`,
						// tooltip: "Remove Asset"
						// }}
						/>
					)
				},
			}),
			columnHelper.accessor('status', {
				id: 'status',
				header: 'Status',
				size: 230,
				meta: {
					filterVariant: 'multi-select',
					filterOptions: Object.values(AssetStatus)
				},
				// filterFn: (row, columnId, filterValue: string[]) => {
				//     if (!filterValue || filterValue.length === 0) {
				// 	return true;
				//     }
				//     const rowValue = row.getValue<string>(columnId);
				//     return filterValue.includes(rowValue);
				// },
				cell: (info) => {
					const assignment = info.row.original.assetAssignment;
					const status = info.row.original.status;
					const style = getAssetStatusStyles[status]
					const mtStyle = getAssetStatusStyles[AssetStatus.Damaged]
					return (
						<div className="flex flex-col gap-2">
							<Badge className={cn(`${style?.bg} ${style?.border} ${style?.text}`,)}>
								{status.toUpperCase()}
							</Badge>
							{
								(assignment?.isBackup && assignment.backupForAssetTag && status === AssetStatus.AssignedForBackup) &&
								<Link to={`/assets/${assignment.backupForAssetTag}`}>
									<Badge className={cn(`${style?.bg} ${style?.border} ${style?.text}`,)}>
										BACKUP FOR {assignment.backupForAssetTag}
									</Badge>
								</Link>
							}
							{
								assignment?.isUnderMaintenance &&
								<Badge className={cn(`${mtStyle?.bg} ${mtStyle?.border} ${mtStyle?.text}`,)}>
									UNDER MAINTENANCE
								</Badge>
							}
						</div>
					);
				}
			}),
			columnHelper.accessor((row) => `${row.assetTag} ${row.serialNumber}`, {
				id: "asset",
				header: 'Asset Tag / SN',
				size: 200,
				cell: (info) => {
					const asset = info.row.original;
					return (
						<div>
							<div className="font-semibold">
								{asset.assetTag}
							</div>
							<div className="text-xs text-gray-500">
								{asset.serialNumber}
							</div>
						</div>
					);
				}
			}),
			columnHelper.accessor('hostname', {
				id: 'hostname',
				header: 'Hostname',
				size: 150,
			}),
			columnHelper.accessor(row => {
				const assignment = row.assetAssignment;
				if (!assignment) return '';
				const status = assignment ? assignment : 'PIC';
				return `${assignment} ${status}`;
			}, {
				id: 'employee',
				header: 'User / PIC',
				size: 250,
				cell: (info) => {
					const assignment = info.row.original.assetAssignment;
					if (!assignment) return <span>-</span>;
					const employeeName = assignment.employee?.name || '-';
					const employeeNik = assignment.employee?.nik || '-';
					const nonEmployeeName = assignment.userNonEmployeeName || 'PIC';
					const active = !assignment.returnedAt;
					return (
						active ?
							<div>
								<div className="font-semibold">
									{`${employeeName} (${nonEmployeeName})`}
								</div>
								<div className="text-xs text-gray-500">
									{`NIK: ${employeeNik}`}
								</div>
							</div>
							:
							"-"
					);
				}
			}),
			columnHelper.accessor(row => row.category.name, {
				id: 'category',
				header: 'Category',
				size: 100,
				meta: {
					filterVariant: 'multi-select',
					filterOptions: ["MW", "WS", "PC", "NB", "MAC"]
				},
				cell: (info) => info.getValue()?.toUpperCase()
			}),
			columnHelper.accessor('type', {
				id: 'type',
				header: 'Type',
				size: 250,
			}),

			columnHelper.accessor(row => row.project?.vendor?.name, {
				id: 'vendor',
				header: 'Vendor/Project',
				size: 400,
				cell: (info) => {
					const project = info.row.original.project;
					return (
						<div>
							<div className="font-semibold">
								{project.vendor.name}
							</div>
							<div className="text-xs text-gray-500">
								{project.name}
							</div>
						</div>
					);
				}
			}),

		],
		[]
	);

	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
	const debouncedFilters = useDebouncedValue(columnFilters, 400);


	const [columnSizing, setColumnSizing] = useState(() => {
		const savedSizes = localStorage.getItem('table-column-sizes');
		return savedSizes ? JSON.parse(savedSizes) : {};
	});

	const { data } = useQuery({
		queryKey: ['assets', pagination, debouncedFilters],
		queryFn: async () =>
			await AssetRepository.getAssets({
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				...columnFiltersToParams(debouncedFilters),
			}),
		placeholderData: (prev) => prev,
	});

	const table = useReactTable<IAsset>({
		data: data?.data ?? [],
		columns,
		state: {
			columnFilters,
			pagination,
			columnSizing
		},
		pageCount: data?.meta?.totalPages ?? -1,
		renderFallbackValue: '-',
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		onColumnSizingChange: setColumnSizing,
		manualPagination: true,
		manualFiltering: true,
	});

	return (<DataTable table={table}
		name='All Assets'
		isLoading={isLoading}
		create={{
			label: "create new asset",
			to: "/assets/create"
		}}
	/>)

}