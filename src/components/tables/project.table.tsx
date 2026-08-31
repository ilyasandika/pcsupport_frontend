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
import type {IProject} from "@/types/project.type.ts";
import type {IVendor} from "@/types/vendor.type.ts";
import {ProjectDialog} from "@/features/projects/components/project-dialog.tsx";
import {ProjectRepository} from "@/data/repositories/project.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, FolderKanban} from "lucide-react";

interface ProjectTableProps {
    data: IProject[];
    vendors?: IVendor[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const ProjectTable = ({data, vendors, isLoading = false, onRefresh}: ProjectTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const { showNotification } = useNotificationDialog();

    const handleOpenDialog = (project?: IProject) => {
        setSelectedProject(project || null);
        setDialogOpen(true);
    };

    const handleDelete = async (targetId: number | string, name: string) => {
        try {
            await ProjectRepository.remove(targetId);
            showNotification({
                variant: 'success',
                title: 'Project Deleted',
                description: `Project "${name}" has been deleted successfully.`,
            });
            onRefresh?.();
        } catch (error: any) {
            showNotification({
                variant: 'error',
                title: 'Delete Failed',
                description: error?.message || 'Could not delete project.',
            });
        }
    };

    const columnHelper = createColumnHelper<IProject>();

    const columns: ColumnDef<IProject, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Project Name',
		size: 300,
		cell: (info) => {
		    const project = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-gray-900 flex items-center gap-2">
				<FolderKanban className="w-4 h-4 text-ptba-primary shrink-0" />
				{project.name}
			    </div>
			    {project.description && (
				<div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
				    {project.description}
				</div>
			    )}
			</div>
		    );
		}
	    }),
	    columnHelper.accessor(row => row.vendor?.name, {
		id: 'vendor',
		header: 'Vendor',
		size: 250,
		cell: (info) => (
		    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
			{info.row.original.vendor?.name || `Vendor #${info.row.original.vendorId || '-'}`}
		    </span>
		),
	    }),
	    // Display column untuk tombol aksi
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => {
		    const project = info.row.original;
		    const targetId = project.id ?? project.name;
		    return (
			<ActionButtons
			    edit={{
				tooltip: "Edit Project",
				onClick: () => handleOpenDialog(project),
			    }}
			    remove={{
				tooltip: "Delete Project",
				alert: {
				    title: "Delete Project",
				    description: `Are you sure you want to delete project "${project.name}"? This action cannot be undone.`,
				    variant: "danger",
				    onContinue: () => handleDelete(targetId, project.name),
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
	const savedSizes = localStorage.getItem('table-column-sizes-project');
	return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
	localStorage.setItem('table-column-sizes-project', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IProject>({
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
		name='All Projects'
		isLoading={isLoading}
		customActions={
		    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1.5">
			<Plus className="w-4 h-4" /> Add Project
		    </Button>
		}
	    />
	    <ProjectDialog
		open={dialogOpen}
		onOpenChange={setDialogOpen}
		initialData={selectedProject}
		vendors={vendors}
		onSuccess={() => onRefresh?.()}
	    />
	</>
    );
};