import {
    type ColumnDef,
    createColumnHelper,
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import DataTable from "./data-table.tsx";
import {ActionButtons} from "./action-button.tsx";
import type {IDetailWorkLocation} from "@/types/work-location.type.ts";
import {LocationDialog} from "@/features/locations/components/location-dialog.tsx";
import {WorkLocationRepository} from "@/data/repositories/work-location.repository.ts";
import {useNotificationDialog} from "@/context/NotificationDialogContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Plus, MapPin, ExternalLink} from "lucide-react";

interface WorkLocationTableProps {
    data: IDetailWorkLocation[];
    isLoading?: boolean;
    onRefresh?: () => void;
}

export const WorkLocationTable = ({data, isLoading = false, onRefresh}: WorkLocationTableProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<IDetailWorkLocation | null>(null);
    const {showNotification} = useNotificationDialog();

    const handleOpenDialog = (location?: IDetailWorkLocation) => {
	setSelectedLocation(location || null);
	setDialogOpen(true);
    };

    const handleDelete = async (id: number | string, name: string) => {
	try {
	    await WorkLocationRepository.remove(id);
	    showNotification({
		variant: 'success',
		title: 'Location Deleted',
		description: `Work location "${name}" has been deleted successfully.`,
	    });
	    onRefresh?.();
	} catch (error: any) {
	    showNotification({
		variant: 'error',
		title: 'Delete Failed',
		description: error?.message || 'Could not delete work location.',
	    });
	}
    };

    const columnHelper = createColumnHelper<IDetailWorkLocation>();
    const columns: ColumnDef<IDetailWorkLocation, any>[] = useMemo(
	() => [
	    columnHelper.accessor('name', {
		header: 'Location Name',
		size: 220,
		cell: (info) => {
		    const location = info.row.original;
		    return (
			<div>
			    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
				<MapPin className="w-4 h-4 text-ptba-primary shrink-0"/>
				{location.name}
			    </div>
			    <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
				{location.description || "No description"}
			    </div>
			</div>
		    );
		}
	    }),
	    columnHelper.accessor('address', {
		header: 'Address',
		size: 300,
		cell: (info) => (
		    <span className="text-xs text-gray-700 block line-clamp-2" title={info.getValue()}>
			{info.getValue() || '-'}
		    </span>
		),
	    }),
	    columnHelper.accessor(row => `${row.latitude}, ${row.longitude}`, {
		id: 'coordinates',
		header: 'Coordinates',
		size: 200,
		cell: (info) => {
		    const location = info.row.original;
		    if (location.latitude == null || location.longitude == null || (location.latitude === 0 && location.longitude === 0)) {
			return <span className="text-gray-400 text-xs">-</span>;
		    }
		    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
		    return (
			<a
			    href={mapsUrl}
			    target="_blank"
			    rel="noopener noreferrer"
			    className="inline-flex items-center gap-1 text-xs text-ptba-primary hover:underline bg-blue-50 px-2 py-1 rounded border border-blue-100"
			    title="View on Google Maps"
			>
			    <span>Lat: {location.latitude}, Long: {location.longitude}</span>
			    <ExternalLink className="w-3 h-3"/>
			</a>
		    );
		}
	    }),
	    // Display column untuk tombol aksi
	    columnHelper.display({
		id: 'actions',
		header: 'Actions',

		cell: (info) => {
		    const location = info.row.original;
		    return (
			<ActionButtons
			    edit={{
				tooltip: "Edit Location",
				onClick: () => handleOpenDialog(location),
			    }}
			    remove={{
				tooltip: "Delete Location",
				dialog: {
				    title: "Delete Work Location",
				    description: `Are you sure you want to delete location "${location.name}"? This action cannot be undone.`,
				    variant: "danger",
				    onContinue: () => handleDelete(location.id, location.name),
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
		name='Work Locations'
		isLoading={isLoading}
		customActions={
		    <Button onClick={() => handleOpenDialog()} className="flex items-center gap-1.5">
			<Plus className="w-4 h-4"/> Add Location
		    </Button>
		}
	    />
	    <LocationDialog
		open={dialogOpen}
		onOpenChange={setDialogOpen}
		initialData={selectedLocation}
		onSuccess={() => onRefresh?.()}
	    />
	</>
    );
};
