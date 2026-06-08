import {type Table, flexRender } from '@tanstack/react-table';
import {Search} from "lucide-react";
import { useState} from "react";

interface DataTableProps<TData> {
    table: Table<TData>;
    isLoading?: boolean;
}

export default function Table<TData>({ table, isLoading = false }: DataTableProps<TData>) {

    const [activeFilter, setActiveFilter] = useState<boolean>(false)


    return (
	<div className="w-full space-y-4">
	    <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
		<Search className="w-6" onClick={() => setActiveFilter(!activeFilter)}/>
		<table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-700">
		    <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
		    {table.getHeaderGroups().map((headerGroup) => (
			<tr key={headerGroup.id}>
			    {headerGroup.headers.map((header) => (
				<th key={header.id} className="px-6 py-4 border-b border-gray-200">
				    <div className="flex flex-col gap-2">
					<span className="font-semibold text-gray-700">
					    {flexRender(header.column.columnDef.header, header.getContext())}
                     			 </span>
					{(header.column.getCanFilter() && activeFilter) ? (
					    <input
						type="text"
						value={(header.column.getFilterValue() ?? '') as string}
						onChange={(e) => header.column.setFilterValue(e.target.value)}
						placeholder={`Cari...`}
						className="w-full px-3 py-1.5 text-xs font-normal lowercase bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
					    />
					) : ""
					}
					{(!header.column.getCanFilter() && activeFilter) ? <div className={'h-7'}/> : "" }
				    </div>
				</th>
			    ))}
			</tr>
		    ))}
		    </thead>


		    <tbody className="divide-y divide-gray-200 bg-white">
		    {isLoading ? (<tr>
			    <td colSpan={table.getAllColumns().length} className="px-6 py-10 text-center text-gray-400 font-medium">
				Sedang memuat data...
			    </td>
			</tr>
		    ) : table.getRowModel().rows.length > 0 ? (
			table.getRowModel().rows.map((row) => (
			    <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
				{row.getVisibleCells().map((cell) => (
				    <td key={cell.id} className="px-6 py-2 whitespace-nowrap text-gray-600 font-normal">
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				    </td>
				))}
			    </tr>
			))
		    ) : (
			<tr>
			    <td colSpan={table.getAllColumns().length} className="px-6 py-10 text-center text-gray-400">
				Data tidak ditemukan.
			    </td>
			</tr>
		    )}
		    </tbody>

		</table>
	    </div>

	    {/* 2. KONTROL PAGINATION */}
	    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
		{/* Info Halaman */}
		<div className="text-sm text-gray-600">
		    Halaman{' '}
		    <span className="font-semibold text-gray-900">
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
		    dari{' '}
		    <span className="font-semibold text-gray-900">
            {table.getPageCount() || 1}
          </span>
		</div>

		{/* Tombol Navigasi */}
		<div className="flex items-center gap-2">
		    <button
			onClick={() => table.previousPage()}
			disabled={!table.getCanPreviousPage()}
			className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
		    >
			Sebelumnya
		    </button>
		    <button
			onClick={() => table.nextPage()}
			disabled={!table.getCanNextPage()}
			className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all"
		    >
			Selanjutnya
		    </button>
		</div>
	    </div>

	</div>
    );
}