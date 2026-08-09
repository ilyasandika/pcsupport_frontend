import {TicketRepository} from "@/data/repositories/ticket.repository.ts";
import type {LoaderFunctionArgs} from "react-router";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";
import {UserRepository} from "@/data/repositories/user.repository.ts";
import {SlaPolicyRepository} from "@/data/repositories/sla-policy.repository.ts";

import { WorkLocationRepository } from "@/data/repositories/work-location.repository.ts";

export const ticketLoader = async () => {
    const [tickets, locations] = await Promise.all([
        TicketRepository.getAll(),
        WorkLocationRepository.getAll(),
    ]);
    return { tickets, locations };
}

export const ticketDetailLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    return await TicketRepository.getTicketById(id)
}

export const ticketFormLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    const [assets, employees, engineers, slaPolicies, ticket] = await Promise.all([
        await AssetRepository.getActiveAssetList(),
        await EmployeeRepository.getEmployeeListForDropdown(),
        await UserRepository.getUsers(),
        await SlaPolicyRepository.getAll(),
        id ? TicketRepository.getTicketById(Number(id)) : Promise.resolve(null)]);
    return {assets, employees, engineers, slaPolicies, ticket};
}
