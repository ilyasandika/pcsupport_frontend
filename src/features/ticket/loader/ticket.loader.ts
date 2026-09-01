import { TicketRepository } from "@/data/repositories/ticket.repository.ts";
import type { LoaderFunctionArgs } from "react-router";
import { EmployeeRepository } from "@/data/repositories/employee.repository.ts";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { SlaPolicyRepository } from "@/data/repositories/sla-policy.repository.ts";

import { WorkLocationRepository } from "@/data/repositories/work-location.repository.ts";

export const ticketLoader = async () => {
    const [tickets, locations] = await Promise.all([
        TicketRepository.getAll(),
        WorkLocationRepository.getAll(),
    ]);
    return { tickets, locations };
}

export const ticketDetailLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params as unknown as { id: number }
    return await TicketRepository.getTicketById(id)
}

export const ticketFormLoader = async ({ params }: LoaderFunctionArgs) => {
    const { id } = params as unknown as { id: number }
    const [employees, engineers, slaPolicies, ticket] = await Promise.all([
        await EmployeeRepository.getEmployeeListForDropdown(),
        await UserRepository.getUsers(),
        await SlaPolicyRepository.getAll(),
        id ? TicketRepository.getTicketById(Number(id)) : Promise.resolve(null)]);
    return { employees, engineers, slaPolicies, ticket };
}
