import {EmployeeRepository} from "../../../data/repositories/employee.repository.ts";

export const employeeLoader = async  () => {
    return await EmployeeRepository.getEmployees()
}