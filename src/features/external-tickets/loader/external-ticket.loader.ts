import {ExternalTicketRepository} from "@/data/repositories/external-ticket.repository.ts";
import type {LoaderFunctionArgs} from "react-router";
import {AssetRepository} from "@/data/repositories/asset.repository.ts";
import {EmployeeRepository} from "@/data/repositories/employee.repository.ts";
import {UserRepository} from "@/data/repositories/user.repository.ts";

export const externalTicketLoader = async () => {
    const [externalTickets] = await Promise.all([
	await ExternalTicketRepository.getAll(),
    ])
    return {externalTickets}
}


export const externalTicketFormLoader = async ({params}: LoaderFunctionArgs) => {
    const {id} = params as unknown as {id: number}
    const [assets, employees, engineers, externalTickets] = await Promise.all([
	await AssetRepository.getActiveAssetList(),
	await EmployeeRepository.getEmployeeListForDropdown(),
	await UserRepository.getUsers(),
	id ? ExternalTicketRepository.getById(+id) : Promise.resolve(null)]);
    return {assets, employees, engineers, externalTickets};
}