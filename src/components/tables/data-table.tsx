import { type Table, flexRender } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, FunnelPlus, Plus, Search } from "lucide-react";
import { useState } from "react";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router";
import {Card} from "@/components/ui/card.tsx";

interface DataTableProps<TData> {
    table: Table<TData>;
    isLoading?: boolean;
    name: string;
    create?: ActionLinkProps;
    edit?: ActionLinkProps;
    export?: ActionButtonProps;
    import?: ActionButtonProps;
}

interface ActionLinkProps {
    label: string;
    to: string;
}

interface ActionButtonProps {
    label: string;
    action: () => void;
}

export default function Table<TData>({ table, isLoading = false, name, create}: DataTableProps<TData>) {
    const [activeFilter, setActiveFilter] = useState<boolean>(false);

    return (
	<div className="w-full space-y-4">
	    <div className="flex justify-between">
               <span className="text-xl text-ptba-text font-bold">
                   {name}
               </span>
		<div className="flex items-center px-1 gap-4">
		    <Button variant={'outline'}
			onClick={() => setActiveFilter(!activeFilter)}
		    >
			<FunnelPlus className="w-4 h-4" />
		    </Button>
		    {create &&
                        <Button asChild>
                            <Link to={create.to}>
				<Plus className="w-4 h-4" data-icon="inline-start"/> {create.label}
			    </Link>
                        </Button>
		    }
		</div>
	    </div>

	    <div className="overflow-x-auto border border-gray-200 rounded-md bg-white
                [&::-webkit-scrollbar]:h-1.5
                [&::-webkit-scrollbar-track]:bg-gray-50
                [&::-webkit-scrollbar-track]:rounded-b-xl
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">

		<table
		    style={{ width: table.getCenterTotalSize() }}
		    className="min-w-full table-fixed divide-y divide-gray-200 text-sm text-left text-gray-700"
		>
		    <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
		    {table.getHeaderGroups().map((headerGroup) => (
			<tr key={headerGroup.id}>
			    {headerGroup.headers.map((header) => (
				<th
				    key={header.id}
				    className="relative px-6 py-3 border-b border-r border-gray-200 last:border-r-0 bg-gray-50 group select-none"
				    style={{ width: `${header.getSize()}px` }}
				>
				    <div className="flex flex-col gap-2 min-h-10 justify-center">
                                    <span className="font-semibold text-gray-700 block truncate" title={header.isPlaceholder ? undefined : flexRender(header.column.columnDef.header, header.getContext()) as string}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </span>

					{header.column.getCanFilter() && activeFilter && (
					    <div className="flex flex-row items-center p-1 gap-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ">
						<Search className='h-3 text-gray-400'/>
						<input
						    type="text"
						    value={(header.column.getFilterValue() ?? '') as string}
						    onChange={(e) => header.column.setFilterValue(e.target.value)}
						    className="w-full text-xs font-normal normal-case focus:outline-none text-gray-700"
						/>
					    </div>
					)}

					{!header.column.getCanFilter() && activeFilter && (
					    <div className="h-8" />
					)}
				    </div>

				    {/* LINE RESIZER (DRAG HANDLER SEPERTI DI WORD/EXCEL) */}
				    <div
					{...{
					    onDoubleClick: () => header.column.resetSize(), // Double klik untuk reset ukuran asli
					    onMouseDown: header.getResizeHandler(),
					    onTouchStart: header.getResizeHandler(),
					    className: `absolute right-0 top-0 h-full w-1 cursor-col-resize bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${
						header.column.getIsResizing() ? 'bg-blue-600 opacity-100 w-1.5' : ''
					    }`,
					}}
				    />
				</th>
			    ))}
			</tr>
		    ))}
		    </thead>

		    <tbody className="divide-y divide-gray-200 bg-white">
		    {isLoading ? (
			<tr>
			    <td colSpan={table.getAllColumns().length} className="px-6 py-12 text-center text-gray-400 font-medium">
				<div className="flex flex-col items-center justify-center gap-2">
				    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
				    <span>loading data ...</span>
				</div>
			    </td>
			</tr>
		    ) : table.getRowModel().rows.length > 0 ? (
			table.getRowModel().rows.map((row) => (
			    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors odd:bg-white even:bg-gray-50/20">
				{row.getVisibleCells().map((cell) => (
				    <td
					key={cell.id}
					className="px-6 py-3 text-ptba-text font-normal border-r border-gray-100 last:border-r-0 overflow-hidden text-ellipsis"
					style={{ width: `${cell.column.getSize()}px` }}
				    >
					<div className="whitespace-normal break-words block line-clamp-2">
					    {flexRender(cell.column.columnDef.cell, cell.getContext()) ?? '-'}
					</div>
				    </td>
				))}
			    </tr>
			))
		    ) : (
			<tr>
			    <td colSpan={table.getAllColumns().length} className="px-6 py-12 text-center text-gray-400">
				data not found.
			    </td>
			</tr>
		    )}
		    </tbody>
		</table>
	    </div>


	    {/* KONTROL PAGINATION */}
	    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
		<div className="text-sm text-gray-600">
		    Page{' '}
		    <span className="font-semibold text-gray-900">
                        {table.getState().pagination.pageIndex + 1}
                    </span>{' '}
		    of{' '}
		    <span className="font-semibold text-gray-900">
                        {table.getPageCount() || 1}
                    </span>
		</div>

		<div className="flex items-center gap-2">
		    <button
			onClick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
			className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
		    >
			<ChevronLeft className='w-4'/>
		    </button>
		    <button
			onClick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
			className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
		    >
			<ChevronRight className='w-4'/>
		    </button>
		</div>
	    </div>
	</div>
    );
}