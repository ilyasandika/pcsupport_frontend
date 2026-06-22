import {useLoaderData, useNavigation} from "react-router";
import type {IEmployee} from "../../../types/employee.type.ts";
import {EmployeeTable} from "../../../components/tables/employee.table.tsx";

export const EmployeePage = () => {
    const employees = useLoaderData<IEmployee[]>()
    const isLoading = useNavigation().state === "loading";

    return <EmployeeTable data={employees} isLoading={isLoading} />
}