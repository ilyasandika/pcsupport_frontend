import type {IChartData} from "./common.type.ts";
import type {IAsset} from "./asset.type.ts";
import type {ICreateTicketDto, IUpdateTicketDto} from "@/features/ticket/dto/ticket.dto.ts";
import type {IEmployee} from "@/types/employee.type.ts";
import type {IUser} from "@/types/user.type.ts";
import type {ISlaPolicy} from "@/types/sla.type.ts";
import type {IWorkLocation} from "@/types/work-location.type.ts";

export const TicketStatus = {
  Open : 'open',
  Pending : 'pending',
  InProgress : 'in progress',
  ClosedRemote : 'closed remote',
  ClosedVisit : 'closed visit',
  ClosedOnsite : 'closed onsite',
  Resolved : 'resolved',
}

export interface ITicketStatusResponse {
  total : number,
  open : number,
  pending : number,
  inProgress : number,
  closedRemote : number,
  closedVisit : number,
  closedOnsite : number,
  resolved : number,
}

export interface ITicketSummary {
  total: number,
  open: number,
  inProgress: number,
  closed: number,
}

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

export interface ITicket {
  id: number;
  fullNumber: string;
  problem: string;
  status: TicketStatusType
  solution?: string;
  startAt?: string;
  solvedAt?: string;
  remarks?: string;
  createdAt: string;
  asset?: IAsset
  engineer?: IUser
  employee?: IEmployee
  createdBy: IUser
  slaPolicy: ISlaPolicy
  location: IWorkLocation
  filePath?: string;
}


export type ITicketForAsset = Omit<ITicket,  'employee' | 'slaPolicy' |
    'asset' |
    'location' |
    'remarks' |
    'createdBy'>;


export type IPrintTicketPayload = {
  phoneNumber?: string;
  engineerId: number;
  supervisorId: number;
  // date: string;
}

export interface ITicketRepository {
  getAllTickets: () => Promise<ITicket[]>
  getTicketSummary: () => Promise<ITicketSummary>
  getTicketTrend: (range?: 'week' | 'month' | 'year') => Promise<IChartData[]>
  getTicketsByEmployeeId: (employeeId: number) => Promise<ITicket[]>
  getTicketById: (id: number) => Promise<ITicket>

  createTicket: (ticket: ICreateTicketDto) => any
  generateTicketPdf: (id: number, payload: IPrintTicketPayload) => Promise<void>
  claimTicket: (id: number) => void
  updateTicket: (id: number, ticket: IUpdateTicketDto) => any
  getSolvedTicketPdf: (id: number) => void
  uploadTicket: (id: number, file: File) => Promise<void>

  hardRemoveTicket: (id: number) => void
}
