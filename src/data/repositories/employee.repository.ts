import type { IEmployee, IEmployeeRepository } from "../../types/employee.type.ts";
import employeeDummy from "../local/employee/employee.data.json";
import { delay } from "../../helper/helper.tsx";

const employeeLocal: IEmployeeRepository = {
    getEmployees: async (): Promise<IEmployee[]> => {
	await delay();
	return employeeDummy as unknown as IEmployee[];
    },
};

const employeeApi: IEmployeeRepository = {
    getEmployees: async (): Promise<IEmployee[]> => {
	return [] as IEmployee[];
    },
};

export const createEmployeeRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || "local";
    return dataMode === "api" ? employeeApi : employeeLocal;
};

export const EmployeeRepository = createEmployeeRepository();
