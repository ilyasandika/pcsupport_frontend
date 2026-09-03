import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { columnFiltersToParams } from '@/helper/helper.tsx';
import type {ISuccessResponse} from "@/types/api.type.ts";

interface UseServerTableOptions<TData> {
    queryKey: string;
    fetcher: (params: { page: number; limit: number; [key: string]: any }) => Promise<ISuccessResponse<TData>>;
    enabled?: boolean;
}

export function useServerTable<TData>({
					  queryKey,
					  fetcher,
				      }: UseServerTableOptions<TData>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const debouncedFilters = useDebouncedValue(columnFilters, 400);

    const query = useQuery({
	queryKey: [queryKey, pagination, debouncedFilters],
	queryFn: async () =>
	    await fetcher({
		page: pagination.pageIndex + 1,
		limit: pagination.pageSize,
		...columnFiltersToParams(debouncedFilters),
	    }),
	placeholderData: (prev) => prev,
    });

    return {
	...query,
	columnFilters,
	setColumnFilters,
	pagination,
	setPagination,
	tableData: query.data?.data ?? [],
	pageCount: (query.data?.meta?.totalPages ?? -1),
    };
}