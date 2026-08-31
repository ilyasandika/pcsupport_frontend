import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useEffect, useMemo, useState} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {ISlaPolicy} from "@/types/sla.type.ts";
import {SlaDialog} from "@/features/sla/components/sla-dialog.tsx";
import {SlaPolicyRepository} from "@/data/repositories/sla-policy.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, ShieldCheck, Clock, CheckCircle2} from "lucide-react";

interface SlaPolicyTableProps {
    data: ISlaPolicy[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

const priorityBadgeColor: Record<string, string> = {
    low: "bg-blue-100 text-blue-700 border-blue-200",
    normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    high: "bg-red-100 text-red-700 border-red-200",
};

const formatDuration = (seconds: number) => {
    if (seconds == null) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts: string[] = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (secs || parts.length === 0) parts.push(`${secs}s`);
    return parts.join(' ');
};

export const SlaPolicyTable = ({data, isLoading = false, onRefresh}: SlaPolicyTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState<ISlaPolicy | null>(null);
    const { showNotification } = useNotificationDialog();

    const handleOpenDialog = (policy?: ISlaPolicy) => {
        setSelectedPolicy(policy || null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number | string, name: string) => {
        try {
            await SlaPolicyRepository.remove(id);
            showNotification({
                variant: 'success',
                title: 'Policy Deleted',
                description: `SLA policy "${name}" has been deleted successfully.`,
            });
            onRefresh?.();
        } catch (error: any) {
            showNotification({
                variant: 'error',
                title: 'Delete Failed',
                description: error?.message || 'Could not delete SLA policy.',
            });
        }
    };

    const columnHelper = createColumnHelper<ISlaPolicy>();

    const columns: ColumnDef<ISlaPolicy, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Policy Name',
		size: 240,
		cell: (info) => {
		    const policy = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
				<ShieldCheck className="w-4 h-4 text-ptba-primary shrink-0" />
				{policy.name}
				{policy.isDefault && (
				    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
					<CheckCircle2 className="w-3 h-3" /> Default
				    </span>
				)}
			    </div>
			    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
				{policy.description || "No description provided."}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('priority', {
		header: 'Priority',
		size: 130,
		cell: (info) => {
		    const prio = (info.getValue() || 'normal').toLowerCase();
		    return (
			<span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${priorityBadgeColor[prio] || 'bg-gray-100 text-gray-700'}`}>
                           {prio}
                       </span>
		    );
		}
	    }),
	    columnHelper.accessor('responseTimeSeconds', {
		header: 'Target Response',
		size: 160,
		cell: (info) => (
		    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
			<Clock className="w-3.5 h-3.5 text-blue-500" />
			{formatDuration(info.getValue())}
		    </div>
		),
	    }),
	    columnHelper.accessor('resolutionTimeSeconds', {
		header: 'Target Resolution',
		size: 160,
		cell: (info) => (
		    <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
			<Clock className="w-3.5 h-3.5 text-amber-500" />
			{formatDuration(info.getValue())}
		    </div>
		),
	    }),
	    columnHelper.accessor('isBusinessHourOnly', {
		header: 'Business Hours Only',
		size: 160,
		cell: (info) => (
		    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
			info.getValue()
			    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
			    : 'bg-gray-100 text-gray-600'
		    }`}>
                       {info.getValue() ? '24/7 Excluded (08-17)' : '24/7 Always Active'}
                   </span>
		),
	    }),
	    // Display column untuk tombol aksi
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => {
		    const policy = info.row.original;
		    return (
			<ActionButtons
			    edit={{
				tooltip: "Edit SLA Policy",
				onClick: () => handleOpenDialog(policy),
			    }}
			    remove={{
				tooltip: "Delete SLA Policy",
				alert: {
				    title: "Delete SLA Policy",
				    description: `Are you sure you want to delete policy "${policy.name}"? This action cannot be undone.`,
				    variant: "danger",
				    onContinue: () => handleDelete(policy.id, policy.name),
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
	const savedSizes = localStorage.getItem('table-column-sizes-sla-policy');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-sla-policy', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<ISlaPolicy>({
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
	<>
	    <DataTable
		table={table}
		name='SLA Policies'
		isLoading={isLoading}
		customActions={
		    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1.5">
			<Plus className="w-4 h-4" /> Add SLA Policy
		    </Button>
		}
	    />
	    <SlaDialog
		open={dialogOpen}
		onOpenChange={setDialogOpen}
		initialData={selectedPolicy}
		onSuccess={() => onRefresh?.()}
	    />
	</>
    );
};