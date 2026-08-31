import { type Table, flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, FunnelPlus, Plus, Search, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Item } from "@/components/ui/item";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { useAuth } from "@/context/AuthContext.tsx";

interface DataTableProps<TData> {
	table: Table<TData>;
	isLoading?: boolean;
	name?: string;
	create?: ActionLinkProps;
	customActions?: ReactNode;
	enableFilter?: boolean;
	enablePagination?: boolean;
}

interface ActionLinkProps {
	label: string;
	to: string;
}

const getColumnTitle = (column: any): string => {
	if (typeof column.columnDef.header === 'string' && column.columnDef.header.trim()) {
		return column.columnDef.header;
	}
	if (column.id) {
		return column.id
			.replace(/([A-Z])/g, ' $1')
			.replace(/_/g, ' ')
			.replace(/^./, (str: string) => str.toUpperCase())
			.trim();
	}
	return 'Column';
};


export default function DataTable<TData>({ table, isLoading = false, name, create, customActions, enableFilter = true, enablePagination = true }: DataTableProps<TData>) {
	const [activeFilter, setActiveFilter] = useState<boolean>(false);
	const { isEngineer } = useAuth();
	return (
		<div className="w-full space-y-4">
			<div className="flex justify-between">
				{
					name &&
					<span className="text-xl text-ptba-text font-bold">
						{name}
					</span>
				}
				{
					enableFilter &&
					<div className="flex items-center px-1 gap-2">
						<Button variant={'outline'}
							onClick={() => setActiveFilter(!activeFilter)}
							title="Toggle Filters"
						>
							<Search className="w-4 h-4" />
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" title="Toggle Columns" className="flex items-center gap-1.5">
									<SlidersHorizontal className="w-4 h-4" />
									<span className="hidden sm:inline text-xs font-medium">Columns</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-[200px] max-h-[300px] overflow-y-auto">
								<DropdownMenuLabel className="text-xs font-semibold">Toggle Columns</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{table
									.getAllLeafColumns()
									.filter((column) => column.getCanHide() && column.id !== 'actions')
									.map((column) => {
										return (
											<DropdownMenuCheckboxItem
												key={column.id}
												className="capitalize text-xs cursor-pointer"
												checked={column.getIsVisible()}
												onSelect={(e) => e.preventDefault()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{getColumnTitle(column)}
											</DropdownMenuCheckboxItem>
										);
									})}
							</DropdownMenuContent>
						</DropdownMenu>
						{(create) &&
							<Button>
								<Link to={create.to} className="flex flex-row items-center gap-2">
									<Plus className="w-4 h-4" data-icon="inline-start" /> {create.label}
								</Link>
							</Button>
						}
						{
							customActions &&
							customActions
						}
					</div>
				}
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
										className="relative px-6 py-3 border-b  border-gray-200  bg-gray-50 group select-none"
										style={{ width: `${header.getSize()}px` }}
									>
										<div className="flex flex-col gap-2 min-h-10 justify-center">
											<span className="font-semibold text-gray-700 block truncate" title={header.isPlaceholder ? undefined : flexRender(header.column.columnDef.header, header.getContext()) as string}>
												{flexRender(header.column.columnDef.header, header.getContext())}
											</span>

											{header.column.getCanFilter() && activeFilter && (
												header.column.columnDef.meta?.filterVariant === "multi-select" ?
													(
														(() => {
															const filterValue = (header.column.getFilterValue() as any[]) ?? [];
															const options = header.column.columnDef.meta?.filterOptions ?? []; return (
																<DropdownMenu>
																	<DropdownMenuTrigger asChild>
																		<Button variant="outline" className="w-full h-8 text-xs flex justify-between px-2 bg-white font-normal text-gray-700">
																			<span className="truncate">
																				{filterValue.length > 0
																					? `${filterValue.length} selected`
																					: `All ${header.id || ""}`}
																			</span>
																			<ChevronDown className="w-4 h-4 opacity-50" />
																		</Button>
																	</DropdownMenuTrigger>
																	<DropdownMenuContent align="start" className="w-fit min-w-[150px]">
																		{options.map((option: any) => {
																			const optVal = typeof option === 'object' && option !== null ? option.value : option;
																			const optLabel = typeof option === 'object' && option !== null ? option.label : option;
																			const isSelected = filterValue.includes(optVal);
																			return (
																				<DropdownMenuCheckboxItem
																					key={String(optVal)}
																					checked={isSelected}
																					onSelect={(e) => e.preventDefault()}
																					onCheckedChange={(checked) => {
																						let newValue = [...filterValue];

																						if (checked) {
																							newValue.push(optVal);
																						} else {
																							newValue = newValue.filter((val) => val !== optVal);
																						}
																						header.column.setFilterValue(newValue.length > 0 ? newValue : undefined);
																					}}
																					className="capitalize cursor-pointer"
																				>
																					{optLabel}
																				</DropdownMenuCheckboxItem>
																			)
																		})}
																	</DropdownMenuContent>
																</DropdownMenu>
															)
														})()
													)
													: header.column.columnDef.meta?.filterVariant === "date" ?
														(
															<InputGroup className="bg-white">
																<InputGroupInput type="date"
																	value={(header.column.getFilterValue() ?? '') as string}
																	onChange={(e) => header.column.setFilterValue(e.target.value)}
																	className="w-full text-xs font-normal normal-case focus:outline-none text-gray-700"
																/>
															</InputGroup>
														)
														:
														<InputGroup className="bg-white">
															<InputGroupInput type="text"
																value={(header.column.getFilterValue() ?? '') as string}
																onChange={(e) => header.column.setFilterValue(e.target.value)}
																className="w-full text-xs font-normal normal-case focus:outline-none text-gray-700"
															/>
															<InputGroupAddon align="inline-start">
																<Search className="text-muted-foreground" />
															</InputGroupAddon>
														</InputGroup>
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
												className: `absolute right-0 top-0 h-full w-0.5 cursor-col-resize bg-ptba-primary-navy opacity-0 group-hover:opacity-100 transition-opacity z-10 ${header.column.getIsResizing() ? 'bg-ptba-primary-navy opacity-100 w-1' : ''
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
											className="px-6 py-3 text-ptba-text font-normalborder-gray-100 overflow-hidden text-ellipsis"
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

			{
				enablePagination &&
				<Item variant="muted" className="flex items-center bg-background justify-between">
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
						<Field orientation="horizontal" className="w-fit">
							<FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
							<Select defaultValue="10" onValueChange={(e) => table.setPageSize(+e)}>
								<SelectTrigger className="w-20" id="select-rows-per-page">
									<SelectValue />
								</SelectTrigger>
								<SelectContent align="start">
									<SelectGroup>
										<SelectItem value="10">10</SelectItem>
										<SelectItem value="25">25</SelectItem>
										<SelectItem value="50">50</SelectItem>
										<SelectItem value="100">100</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>
						<Button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							variant="outline"
							className="cursor-pointer"
						>
							<ChevronLeft className='w-4' />
						</Button>
						<Button
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							variant="outline"
							className="cursor-pointer"
						>
							<ChevronRight className='w-4' />
						</Button>
					</div>
				</Item>
			}
		</div>
	);
}