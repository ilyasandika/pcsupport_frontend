import type {IDetailEmployee, IEmployee, IEmployeeRepository, ICreateEmployeeDto, IUpdateEmployeeDto} from "@/types/employee.type.ts";
import api from "../api/interceptors.ts";

const employeeApi: IEmployeeRepository = {
    getEmployees: async (): Promise<IDetailEmployee[]> => {
	const res = await api.get('employees')
	return res.data
    },
    getEmployeeByNik: async (nik: string): Promise<IDetailEmployee> => {
	const res = await api.get(`/employees/${nik}`)
	return res.data
    },
    getEmployeeListForDropdown: async (): Promise<IEmployee[]> => {
	const res = await api.get('/employees/list');
	return res.data
    },
    importEmployees: async (file: File) => {
	try {
	    const formData = new FormData();
	    formData.append('file', file);
	    const res = await api.post('employees/import-excel', formData)
	    return res.data
	} catch (error) {
	    console.error('Error importing employees:', error);
	    throw error;
	}
    },
    createEmployee: async (dto: ICreateEmployeeDto): Promise<IDetailEmployee> => {
	const res = await api.post('/employees', dto);
	return res.data;
    },
    updateEmployee: async (nik: string, dto: IUpdateEmployeeDto): Promise<IDetailEmployee> => {
	const res = await api.patch(`/employees/${nik}`, dto);
	return res.data;
    },
    deleteEmployee: async (nik: string): Promise<void> => {
	await api.delete(`/employees/${nik}`);
    }
};

export const createEmployeeRepository = () => {
    return employeeApi;
};

export const EmployeeRepository = createEmployeeRepository();

