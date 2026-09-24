import {
    type ColumnDef,
    createColumnHelper
} from "@tanstack/react-table";
import {useMemo} from "react";
import DataTable from "./data-table.tsx";
import {AssetStatus, type IAsset} from "@/types/asset.type.ts";
import {Badge} from "@/components/ui/badge";
import {getAssetStatusStyles} from "@/helper/style-helper.tsx";
import {cn} from "@/lib/utils.ts";
import {Link} from "react-router";

import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import {useServerTable} from "@/hooks/use-server-table.ts";
import {ActionButtons} from "@/components/tables/action-button.tsx";
import {useAuth} from "@/context/AuthContext.tsx";
import {useDeleteAsset} from "@/features/asset/hooks/use-delete-asset.ts";

export const AssetTable = () => {
    const {isAdmin} = useAuth()
    const {mutate: deleteAsset} = useDeleteAsset()
    const columnHelper = createColumnHelper<IAsset>();
    const columns: ColumnDef<IAsset, any>[] = useMemo(
	() => [
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => {
		    const id = info.row.original.assetTag
		    const isUsed = info.row.original.isUsed
		    return (
			<ActionButtons
			    detail={{
				to: `${id}`,
				tooltip: "Detail Asset"
			    }}
			    edit={{
				to: `${`${id}/update`}`,
				tooltip: "Edit Asset",
				disabled: !isAdmin(),
			    }}
			    remove={{
				dialog: {
				    type: "alert",
				    title: "Are you sure remove this asset?",
				    description: "This action cannot be undone",
				    variant: "danger",
				    onContinue: () => deleteAsset(id),
				},
			    	tooltip: "Remove Asset",
				disabled: !isAdmin() || isUsed,
			    }}
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
		id: 'vendorProject',
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


    const {
	columnFilters,
	setColumnFilters,
	pagination,
	setPagination,
	tableData,
	pageCount
    } = useServerTable({
	queryKey: 'assets',
	fetcher: (params) => AssetRepository.getAssets(params),
    });

    return (
	<DataTable
	    data={tableData}
	    columns={columns}
	    name='All Assets'
	    create={isAdmin() ? {
		label: "Create New Asset",
		to: "/assets/create"
	    }: undefined}
	    pageCount={pageCount}
	    columnFilters={columnFilters}
	    onColumnFiltersChange={setColumnFilters}
	    isManual
	    pagination={pagination}
	    onPaginationChange={setPagination}
	/>)

}