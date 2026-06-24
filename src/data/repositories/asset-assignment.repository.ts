import type { IAssetAssignment, IAssetAssignmentRepository } from "../../types/asset-assignment.type.ts"; // Sesuaikan path type kamu
import assetAssignmentDummy from '../local/asset-assignment/asset-assignment.data.json';
import { delay } from "../../helper/helper.tsx";

const assetAssignmentLocal: IAssetAssignmentRepository = {
    getAssetAssignmentsByAssetId: async (assetId: number): Promise<IAssetAssignment[]> => {
	await delay();
	return assetAssignmentDummy.filter(assignment => {
	    return assignment.assetId === assetId;
	}) as unknown as IAssetAssignment[];
    },
    getAssetAssignmentsByEmployeeId: async (employeeId: number): Promise<IAssetAssignment[]> => {
	await delay();
	return assetAssignmentDummy.reduce<IAssetAssignment[]>((acc, assign) => {
	    if (assign.picEmployeeId === employeeId) {
		const assetDetail = assetAssignmentDummy.find(ast => ast.id === assign.assetId);
		acc.push({
		    ...assign,
		    asset: assetDetail
		} as unknown as IAssetAssignment);
	    }
	    return acc;
	}, []);
    }
};

const assetAssignmentApi: IAssetAssignmentRepository = {
    getAssetAssignmentsByAssetId: async (assetId: number): Promise<IAssetAssignment[]> => {
	console.log("Fetch API Assignment by Asset ID:", assetId);
	return [] as IAssetAssignment[];
    },
    getAssetAssignmentsByEmployeeId: async (employeeId: number): Promise<IAssetAssignment[]> => {
	console.log("Fetch API Assignment by Employee ID:", employeeId);
	return [] as IAssetAssignment[];
    }
};

export const createAssetAssignmentRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetAssignmentApi : assetAssignmentLocal;
};

export const AssetAssignmentRepository = createAssetAssignmentRepository();