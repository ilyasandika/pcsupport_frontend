import type { IEmployee, IEmployeeRepository } from "../../types/employee.type.ts";
import employeeDummy from "../local/employee/employee.data.json";
import { delay } from "../../helper/helper.tsx";
import {AssetAssignmentRepository} from "./asset-assignment.repository.ts";
import {TicketRepository} from "./ticket.repository.ts";
import type {IAssetAssignment} from "../../types/asset-assignment.type.ts";
import type {ITicket} from "../../types/ticket.type.ts";
import api from "../api/interceptors.ts";

const employeeLocal: IEmployeeRepository = {
    getEmployees: async (): Promise<IEmployee[]> => {
	await delay();
	return employeeDummy as unknown as IEmployee[];
    },
    getEmployeeDetail: async (employeeId: number): Promise<IEmployee> => {
	await delay();
	const employee = employeeDummy.find(emp => emp.id === Number(employeeId));
	const assetHistories: IAssetAssignment[] = await AssetAssignmentRepository.getAssetAssignmentsByEmployeeId(employeeId);
	const ticketHistories: ITicket[] = await TicketRepository.getTicketsByEmployeeId(employeeId)

	return {
	    ...employee ?? {} as IEmployee,
	    assetAssignments: assetHistories,
	    tickets: ticketHistories,
	}
    }
};

const employeeApi: IEmployeeRepository = {
    getEmployees: async (): Promise<IEmployee[]> => {
	const res = await api.get('employees')
	console.log(res.data)
	return res.data
    },
    getEmployeeDetail: async (employeeId: number): Promise<IEmployee> => {
	const res = await api.get(`/employees/${employeeId}`)
	return res.data
    }
};

export const createEmployeeRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || "local";
    return dataMode === "api" ? employeeApi : employeeLocal;
};

export const EmployeeRepository = createEmployeeRepository();
