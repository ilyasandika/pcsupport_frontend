import type {IDetailEmployee, IEmployee, IEmployeeRepository} from "@/types/employee.type.ts";
import employeeDummy from "../local/employee/employee.data.json";
import { delay } from "../../helper/helper.tsx";
import api from "../api/interceptors.ts";

const employeeLocal: IEmployeeRepository = {
    getEmployees: async (): Promise<IDetailEmployee[]> => {
	await delay();
	return employeeDummy as unknown as IDetailEmployee[];
    },
    getEmployeeDetail: async (nik: string): Promise<IDetailEmployee> => {
	await delay();
	const employee = employeeDummy.find(emp => emp.nik === nik);
	// const assetHistories: IDetailAssetAssignment[] = await AssetAssignmentRepository.getAssetAssignmentsByEmployeeId(employeeId);
	// const ticketHistories: ITicket[] = await TicketRepository.getTicketsByEmployeeId(nik)

	return {
	    ...employee ?? {} as IDetailEmployee,
	    assetAssignments: [],
	    tickets: [],
	}
    },
    getEmployeeListForDropdown: async (): Promise<IEmployee[]> => {
	return []
    }
};

const employeeApi: IEmployeeRepository = {
    getEmployees: async (): Promise<IDetailEmployee[]> => {
	const res = await api.get('employees')
	console.log(res.data)
	return res.data
    },
    getEmployeeDetail: async (nik: string): Promise<IDetailEmployee> => {
	const res = await api.get(`/employees/${nik}`)
	return res.data
    },
    getEmployeeListForDropdown: async (): Promise<IEmployee[]> => {
	const res = await api.get('/employees/list');
	return res.data
    }
};

export const createEmployeeRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || "local";
    return dataMode === "api" ? employeeApi : employeeLocal;
};

export const EmployeeRepository = createEmployeeRepository();
