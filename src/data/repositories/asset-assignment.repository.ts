import type { IDetailAssetAssignment, IAssetAssignmentRepository } from "../../types/asset-assignment.type.ts"; // Sesuaikan path type kamu
import assetAssignmentDummy from '../local/asset-assignment/asset-assignment.data.json';
import { delay } from "../../helper/helper.tsx";

const assetAssignmentLocal: IAssetAssignmentRepository = {
    getAssetAssignmentsByAssetId: async (assetId: number): Promise<IDetailAssetAssignment[]> => {
	await delay();
	return assetAssignmentDummy.filter(assignment => {
	    return assignment.assetId === assetId;
	}) as unknown as IDetailAssetAssignment[];
    },
    getAssetAssignmentsByEmployeeId: async (employeeId: number): Promise<IDetailAssetAssignment[]> => {
	await delay();
	return assetAssignmentDummy.reduce<IDetailAssetAssignment[]>((acc, assign) => {
	    if (assign.picEmployeeId === employeeId) {
		const assetDetail = assetAssignmentDummy.find(ast => ast.id === assign.assetId);
		acc.push({
		    ...assign,
		    asset: assetDetail
		} as unknown as IDetailAssetAssignment);
	    }
	    return acc;
	}, []);
    }
};

const assetAssignmentApi: IAssetAssignmentRepository = {
    getAssetAssignmentsByAssetId: async (assetId: number): Promise<IDetailAssetAssignment[]> => {
	console.log("Fetch API Assignment by Asset ID:", assetId);
	return [] as IDetailAssetAssignment[];
    },
    getAssetAssignmentsByEmployeeId: async (employeeId: number): Promise<IDetailAssetAssignment[]> => {
	console.log("Fetch API Assignment by Employee ID:", employeeId);
	return [] as IDetailAssetAssignment[];
    }
};

export const createAssetAssignmentRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? assetAssignmentApi : assetAssignmentLocal;
};

export const AssetAssignmentRepository = createAssetAssignmentRepository();