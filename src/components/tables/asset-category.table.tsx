import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import DataTable from "./data-table.tsx";
import { ActionButtons } from "./action-button.tsx";
import type { IAssetCategory } from "@/types/asset-category.type.ts";
import { AssetCategoryDialog } from "@/features/asset/components/asset-category-dialog.tsx";
import { AssetCategoryRepository } from "@/data/repositories/asset-category.repository.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus, Tags } from "lucide-react";

interface AssetCategoryTableProps {
    data: IAssetCategory[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const AssetCategoryTable = ({ data, isLoading = false, onRefresh }: AssetCategoryTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<IAssetCategory | null>(null);
    const { showNotification } = useNotificationDialog();

    const handleOpenDialog = (category?: IAssetCategory) => {
        setSelectedCategory(category || null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number | string, name: string) => {
        try {
            await AssetCategoryRepository.remove(id);
            showNotification({
                variant: 'success',
                title: 'Category Deleted',
                description: `Asset category "${name}" has been deleted successfully.`,
            });
            onRefresh?.();
        } catch (error: any) {
            showNotification({
                variant: 'error',
                title: 'Delete Failed',
                description: error?.message || 'Could not delete asset category.',
            });
        }
    };

    const columnHelper = createColumnHelper<IAssetCategory>();

    const columns: ColumnDef<IAssetCategory, any>[] = useMemo(
        () => [
            columnHelper.accessor('name', {
                header: 'Category Name',
                size: 250,
                cell: (info) => (
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                        <Tags className="w-4 h-4 text-ptba-primary shrink-0" />
                        {info.getValue()}
                    </div>
                )
            }),
            columnHelper.accessor('description', {
                header: 'Description',
                size: 400,
                cell: (info) => (
                    <span className="text-xs text-gray-600 block line-clamp-2" title={info.getValue()}>
                        {info.getValue() || '-'}
                    </span>
                ),
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (info) => {
                    const category = info.row.original;
                    return (
                        <ActionButtons
                            edit={{
                                tooltip: "Edit Category",
                                onClick: () => handleOpenDialog(category),
                            }}
                            remove={{
                                tooltip: "Delete Category",
                                alert: {
                                    title: "Delete Asset Category",
                                    description: `Are you sure you want to delete category "${category.name}"? This action cannot be undone.`,
                                    variant: "danger",
                                    onContinue: () => handleDelete(category.id, category.name),
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
        const savedSizes = localStorage.getItem('table-column-sizes-asset-category');
        return savedSizes ? JSON.parse(savedSizes) : {};
    });

    useEffect(() => {
        localStorage.setItem('table-column-sizes-asset-category', JSON.stringify(columnSizing));
    }, [columnSizing]);

    const table = useReactTable<IAssetCategory>({
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
                name='All Asset Categories'
                isLoading={isLoading}
                customActions={
                    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> Add Category
                    </Button>
                }
            />
            <AssetCategoryDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                initialData={selectedCategory}
                onSuccess={() => onRefresh?.()}
            />
        </>
    );
};