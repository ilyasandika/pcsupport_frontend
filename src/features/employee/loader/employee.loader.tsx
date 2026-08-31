import { EmployeeRepository } from "../../../data/repositories/employee.repository.ts";
import { WorkLocationRepository } from "../../../data/repositories/work-location.repository.ts";
import type { LoaderFunctionArgs } from "react-router";

export const employeeLoader = async () => {
    return await EmployeeRepository.getEmployees();
};

export const employeeFormLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params;
    const [workLocations, employee] = await Promise.all([
        WorkLocationRepository.getAll(),
        id ? EmployeeRepository.getEmployeeByNik(id) : Promise.resolve(null),
    ]);
    return { employee, workLocations };
};