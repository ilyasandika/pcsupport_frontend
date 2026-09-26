import {
    type ColumnDef,
    createColumnHelper,
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import {TemplateType, type ITemplate} from "@/types/template.type.ts";
import {UploadTemplateDialog} from "@/features/templates/components/upload-template-dialog.tsx";
import {TemplateRepository} from "@/data/repositories/template.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, FileText} from "lucide-react";

interface TemplateTableProps {
    data: ITemplate[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

const templateTypeLabel: Record<TemplateType, string> = {
    [TemplateType.Ticket]: 'Ticket',
    [TemplateType.BastAssign]: 'BAST Assign',
    [TemplateType.BastReturn]: 'BAST Return',
    [TemplateType.BastBackup]: 'BAST Backup',
};

const templateTypeColor: Record<TemplateType, string> = {
    [TemplateType.Ticket]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TemplateType.BastAssign]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [TemplateType.BastReturn]: 'bg-purple-100 text-purple-700 border-purple-200',
    [TemplateType.BastBackup]: 'bg-amber-100 text-amber-700 border-amber-200',
};

export const TemplateTable = ({data, isLoading = false, onRefresh}: TemplateTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ITemplate | null>(null);
    const {showNotification} = useNotificationDialog();

    const handleOpenUpload = (template?: ITemplate) => {
	setSelectedTemplate(template || null);
	setDialogOpen(true);
    };

    const handleDelete = async (id: number | string) => {
	try {
	    await TemplateRepository.remove(id);
	    showNotification({
		variant: 'success',
		title: 'Template Deleted',
		description: 'The template has been deleted successfully.',
	    });
	    onRefresh?.();
	} catch (error: any) {
	    showNotification({
		variant: 'error',
		title: 'Failed to delete',
		description: error?.message || 'Could not delete template.',
	    });
	}
    };

    const handleDownload = async (template: ITemplate) => {
	try {
	    const fileName = template.filePath.split('/').pop()?.split('\\').pop();
	    await TemplateRepository.downloadDocument(template.id, fileName);
	    showNotification({
		variant: 'success',
		title: 'Downloading Document',
		description: `Downloading template ${fileName || template.name}...`,
	    });
	} catch (error: any) {
	    showNotification({
		variant: 'error',
		title: 'Download Failed',
		description: error?.message || 'Could not download template document.',
	    });
	}
    };

    const columnHelper = createColumnHelper<ITemplate>();

    const columns: ColumnDef<ITemplate, any>[] = useMemo(
	() => [
	    columnHelper.accessor('type', {
		header: 'Type',
		size: 160,
		cell: (info) => {
		    const typeVal = info.getValue() as TemplateType;
		    return (
			<span
			    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${templateTypeColor[typeVal] || 'bg-gray-100 text-gray-700'}`}>
							{templateTypeLabel[typeVal] ?? typeVal}
						</span>
		    );
		},
	    }),
	    columnHelper.accessor('name', {
		header: 'Template Info',
		size: 260,
		cell: (info) => {
		    const template = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
				<FileText className="w-4 h-4 text-ptba-primary"/>
				{template.name || `${templateTypeLabel[template.type]} Template`}
			    </div>
			    <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">
				{template.description || "No description provided."}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('updatedAt', {
		header: 'Last Updated',
		size: 160,
		cell: (info) => {
		    const val = info.getValue();
		    if (!val) return <span className="text-gray-400">-</span>;
		    const date = new Date(val);
		    return (
			<span className="text-xs text-gray-600">
							{isNaN(date.getTime()) ? String(val) : date.toLocaleDateString('id-ID', {
							    year: 'numeric',
							    month: 'short',
							    day: 'numeric',
							    hour: '2-digit',
							    minute: '2-digit'
							})}
						</span>
		    );
		}
	    }),
	    // Display column untuk tombol aksi
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',
		cell: (info) => {
		    const template = info.row.original;
		    return (
			<ActionButtons
			    seeDocument={{
				tooltip: "Preview Template (DOCX)",
				to: `${template.id}/preview`
			    }}
			    download={{
				tooltip: "Download Template",
				onClick: () => handleDownload(template),
			    }}
			    edit={{
				tooltip: "Update Template",
				onClick: () => handleOpenUpload(template),
			    }}
			    remove={{
				tooltip: "Delete Template",
				dialog: {
				    title: "Delete Template",
				    description: `Are you sure you want to delete template "${templateTypeLabel[template.type]}"? This action cannot be undone.`,
				    variant: "danger",
				    onContinue: () => handleDelete(template.id),
				}
			    }}
			/>
		    );
		},
	    }),
	],
	[]
    );

    return (
	<>
	    <DataTable
		data={data}
		columns={columns}
		name='All Templates'
		isLoading={isLoading}
		customActions={
		    <Button onClick={() => handleOpenUpload()} className="flex items-center gap-1.5">
			<Plus className="w-4 h-4"/> Upload Template
		    </Button>
		}
	    />

	    <UploadTemplateDialog
		open={dialogOpen}
		onOpenChange={setDialogOpen}
		initialData={selectedTemplate}
		onSuccess={() => onRefresh?.()}
	    />
	</>
    );
};
