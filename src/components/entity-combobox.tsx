"use client"

import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
	Combobox,
	ComboboxInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxList,
	ComboboxItem,
} from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"
import { Item, ItemContent, ItemTitle, ItemDescription } from "@/components/ui/item"

/**
 * Props generic untuk EntityCombobox.
 * T = tipe data item (IAsset, IEmployee, IUser, dll)
 */
export interface EntityComboboxProps<T> {
	/** List data yang mau ditampilkan/dicari */
	items: T[]
	/** Item yang sedang terpilih (atau null) */
	value: T | any | null
	/** Ambil key unik untuk React key, mis. (a) => a.serialNumber */
	getKey: (item: T) => string | number
	/**
	 * String yang dipakai untuk searching & sebagai "value" combobox.
	 * Biasanya gabungan beberapa field, mis. `${assetTag} | ${brand} ${model}`
	 */
	onInputValueChange?: (inputValue: string) => void
	getSearchValue: (item: T) => string
	/** Teks yang tampil di ItemTitle (baris atas) */
	getLabel: (item: T) => string
	getTitle: (item: T) => string
	/** Teks yang tampil di ItemDescription (baris bawah), optional */
	getDescription?: (item: T) => string
	/** Dipanggil saat user klik salah satu item di list */
	onSelect: (item: T) => void

	/** Dipanggil saat user klik tombol X untuk clear */
	onClear?: () => void
	placeholder?: string
	emptyMessage?: string
	disabled?: boolean
	className?: string
}

export function EntityCombobox<T>({
	items,
	value,
	getKey,
	getSearchValue,
	getTitle,
	getLabel,
	getDescription,
	onSelect,
	onInputValueChange,
	onClear,
	placeholder = "",
	emptyMessage = "No items found.",
	disabled = false,
	className,
}: EntityComboboxProps<T>) {
	return (
		<Combobox
			items={items}
			itemToStringLabel={getLabel}
			itemToStringValue={getSearchValue}
			value={value}
			autoHighlight
			disabled={disabled}
			onInputValueChange={onInputValueChange}
			limit={10}
		>
			<ComboboxInput
				placeholder={placeholder}
				className={cn("has-disabled:opacity-100 bg-background", className)}
				disabled={disabled}
			>
				{value && (
					<InputGroupAddon
						align="inline-end"
						className="cursor-pointer"
						onClick={() => onClear?.()}
					>
						<XIcon className="w-4 h-4" />
					</InputGroupAddon>
				)}
			</ComboboxInput>
			<ComboboxContent
				onWheel={(e) => e.stopPropagation()}
				className="pointer-events-auto"
			>
				<ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
				<ComboboxList>
					{(item: T) => (
						<ComboboxItem
							key={getKey(item)}
							value={getSearchValue(item)}
							onClick={() => onSelect(item)}
						>
							<Item size="xs" className="p-0">
								<ItemContent>
									<ItemTitle>{getTitle(item)}</ItemTitle>
									{getDescription && (
										<ItemDescription>
											{getDescription(item)}
										</ItemDescription>
									)}
								</ItemContent>
							</Item>
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	)
}