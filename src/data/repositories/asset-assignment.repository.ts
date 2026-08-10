import type {
    IDetailAssetAssignment,
    IAssetAssignmentRepository,
    IReturnAssetAssignmentPayload, ICreateAssetAssignmentPayload, IGenerateAssetAssignmentPayload,
    IUpdateAssetAssignmentPayload
} from "@/types/asset-assignment.type.ts";
import api from "@/data/api/interceptors.ts";

const assetAssignmentApi: IAssetAssignmentRepository = {
    getAssetAssignmentsByAssetId: async (assetId: number): Promise<IDetailAssetAssignment[]> => {
	console.log("Fetch API Assignment by Asset ID:", assetId);
	return [] as IDetailAssetAssignment[];
    },
    getAssetAssignmentsByEmployeeId: async (employeeId: number): Promise<IDetailAssetAssignment[]> => {
	console.log("Fetch API Assignment by Employee ID:", employeeId);
	return [] as IDetailAssetAssignment[];
    },
    create: async (payload: ICreateAssetAssignmentPayload): Promise<IDetailAssetAssignment> => {
	const res = await api.post('/asset-assignments', payload);
	return res.data;
    },
    update: async (
	id: number | string,
	payload: IUpdateAssetAssignmentPayload,
    ): Promise<IDetailAssetAssignment> => {
	const res = await api.patch(`/asset-assignments/${id}`, payload);
	return res.data;
    },
    deleteAssignment: async (id: number | string): Promise<void> => {
	await api.delete(`/asset-assignments/${id}`);
    },
    returnAssignment: async (
	id: number | string,
	payload: IReturnAssetAssignmentPayload,
    ): Promise<IDetailAssetAssignment> => {
	const res = await api.patch(`/asset-assignments/${id}/return`, payload);
	return res.data;
    },
    generateDocument: async (
	id: number | string,
	payload: IGenerateAssetAssignmentPayload,
	type: 'assign' | 'return',
    ) => {
	console.log(id, payload)
	const endpoint = type === 'assign'
	    ? `/asset-assignments/${id}/assign/pdf`
	    : `/asset-assignments/${id}/return/pdf`;
	const res = await api.post(endpoint, payload, {
	    responseType: 'blob',
	});
	const blob = new Blob([res.data], { type: 'application/pdf' });
	const blobUrl = URL.createObjectURL(blob);
	window.open(blobUrl, '_blank');
    },
    uploadDocument: async (
	id: number | string,
	file: File,
	type: 'assign' | 'return',
    ) => {
	const formData = new FormData();
	formData.append('file', file);
	const endpoint = type === 'assign'
	    ? `/asset-assignments/${id}/upload`
	    : `/asset-assignments/${id}/return/upload`;
	const res = await api.post(endpoint, formData, {
	    headers: {
		'Content-Type': 'multipart/form-data',
	    },
	});
	return res.data;
    },
    viewDocument: async (
	id: number | string,
	type: 'assign' | 'return',
    ) => {
	try {
	    const endpoint = type === 'assign'
		? `/asset-assignments/${id}/pdf`
		: `/asset-assignments/${id}/return/pdf`;
	    const res = await api.get(endpoint, {
		responseType: 'blob'
	    });
	    const blob = new Blob([res.data], { type: 'application/pdf' });
	    const blobUrl = URL.createObjectURL(blob);
	    window.open(blobUrl, '_blank');
	} catch (error) {
	    console.error('Error fetching PDF:', error);
	}
    },
};

export const createAssetAssignmentRepository = () => {
    return assetAssignmentApi
};

export const AssetAssignmentRepository = createAssetAssignmentRepository();