import type {LoaderFunctionArgs} from "react-router";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";

export const employeeDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: string}
    return await EmployeeRepository.getEmployeeByNik(id)
}
