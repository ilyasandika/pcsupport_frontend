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
import type {IVendor} from "@/types/vendor.type.ts";
import {VendorDialog} from "@/features/vendors/components/vendor-dialog.tsx";
import {VendorRepository} from "@/data/repositories/vendor.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, Building2, Phone, Mail, MessageSquare, User, Globe, PhoneCall} from "lucide-react";

interface VendorTableProps {
    data: IVendor[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

const getContactIcon = (type: string) => {
    const lower = type.toLowerCase();
    if (lower.includes("phone") || lower.includes("call")) return <Phone className="w-3 h-3 text-blue-600 shrink-0" />;
    if (lower.includes("email") || lower.includes("mail")) return <Mail className="w-3 h-3 text-rose-600 shrink-0" />;
    if (lower.includes("whatsapp") || lower.includes("wa")) return <MessageSquare className="w-3 h-3 text-emerald-600 shrink-0" />;
    if (lower.includes("user") || lower.includes("person")) return <User className="w-3 h-3 text-purple-600 shrink-0" />;
    if (lower.includes("web") || lower.includes("site")) return <Globe className="w-3 h-3 text-cyan-600 shrink-0" />;
    return <PhoneCall className="w-3 h-3 text-gray-500 shrink-0" />;
};

export const VendorTable = ({data, isLoading = false, onRefresh}: VendorTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
    const { showNotification } = useNotificationDialog();

    const handleOpenDialog = (vendor?: IVendor) => {
        setSelectedVendor(vendor || null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number | string, name: string) => {
        try {
            await VendorRepository.remove(id);
            showNotification({
                variant: 'success',
                title: 'Vendor Deleted',
                description: `Vendor "${name}" has been deleted successfully.`,
            });
            onRefresh?.();
        } catch (error: any) {
            showNotification({
                variant: 'error',
                title: 'Delete Failed',
                description: error?.message || 'Could not delete vendor.',
            });
        }
    };

    const columnHelper = createColumnHelper<IVendor>();

    const columns: ColumnDef<IVendor, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Vendor Name',
		size: 250,
		cell: (info) => (
		    <div className="font-semibold text-gray-900 flex items-center gap-2">
			<Building2 className="w-4 h-4 text-ptba-primary shrink-0" />
			{info.getValue()}
		    </div>
		)
	    }),
	    columnHelper.accessor('contacts', {
		id: 'contacts',
		header: 'Support Contacts',
		size: 400,
		cell: (info) => {
		    const contacts = info.row.original.contacts || [];
		    if (contacts.length === 0) {
			return <span className="text-xs text-gray-400 font-normal">-</span>;
		    }
		    return (
			<div className="flex flex-wrap gap-1.5 py-1">
			    {contacts.map((contact, idx) => (
				<div
				    key={idx}
				    className="inline-flex items-center gap-1 text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium"
				>
				    {getContactIcon(contact.type)}
				    <span className="font-semibold text-[11px] text-gray-500 uppercase">{contact.type}:</span>
				    <span>{contact.value}</span>
				</div>
			    ))}
			</div>
		    );
		}
	    }),
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => {
		    const vendor = info.row.original;
		    return (
			<ActionButtons
			    edit={{
				tooltip: "Edit Vendor",
				onClick: () => handleOpenDialog(vendor),
			    }}
			    remove={{
				tooltip: "Delete Vendor",
				dialog: {
				    title: "Delete Vendor",
				    description: `Are you sure you want to delete vendor "${vendor.name}"? This action cannot be undone.`,
				    variant: "danger",
				    onContinue: () => handleDelete(vendor.id, vendor.name),
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
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [columnSizing, setColumnSizing] = useState(() => {
	const savedSizes = localStorage.getItem('table-column-sizes-vendor');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-vendor', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IVendor>({
	data,
	columns,
	state: {
	    columnFilters,
	    pagination,
	    columnSizing,
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
		name='All Vendors'
		isLoading={isLoading}
		customActions={
		    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1.5">
			<Plus className="w-4 h-4" /> Add Vendor
		    </Button>
		}
	    />
	    <VendorDialog
		open={dialogOpen}
		onOpenChange={setDialogOpen}
		initialData={selectedVendor}
		onSuccess={() => onRefresh?.()}
	    />
	</>
    );
};