import type { IChartData } from "./common.type.ts";
import type { IAsset } from "./asset.type.ts";
import type { IEmployee } from "@/types/employee.type.ts";
import type { IUser } from "@/types/user.type.ts";
import type { ISlaPolicy } from "@/types/sla.type.ts";
import type { IWorkLocation } from "@/types/work-location.type.ts";
import type { ISuccessResponse } from "@/types/api.type.ts";

export const TicketStatus = {
  Open: 'open',
  Pending: 'pending',
  Cancelled: 'cancelled',
  InProgress: 'in progress',
  ClosedRemote: 'closed remote',
  ClosedVisit: 'closed visit',
  ClosedOnsite: 'closed onsite',
  Resolved: 'resolved',
}

export interface ITicketStatusResponse {
  total: number,
  open: number,
  cancelled: number,
  pending: number,
  inProgress: number,
  closedRemote: number,
  closedVisit: number,
  closedOnsite: number,
  resolved: number,
}

export interface ITicketSummary {
  total: number,
  open: number,
  inProgress: number,
  closed: number,
  cancelled: number,
}


export interface ITicketFilters {
  asset?: string;
  assetTag?: string;
  assetSn?: string;

  employee?: string;
  employeeName?: string;
  employeeNik?: string;

  engineerName?: string;
  createdByName?: string;

  status?: string;
  ticketNumber?: string;
  location?: string;
  problem?: string;
  startAt?: string;
  solvedAt?: string;
  solution?: string;
  page?: number;
  limit?: number;
}

export type TicketStatusType = typeof TicketStatus[keyof typeof TicketStatus];

export interface ITicketSnapshot {
  division?: string;
  position?: string;
  department?: string;
  userNonEmployee?: string;
}

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
  contact?: string;
  engineer?: IUser
  employee?: IEmployee
  snapshot?: ITicketSnapshot;
  createdBy: IUser
  slaPolicy: ISlaPolicy
  location: IWorkLocation
  filePath?: string;
}


export type ITicketForAsset = Omit<ITicket, 'employee' | 'slaPolicy' |
  'asset' |
  'location' |
  'remarks' |
  'createdBy'>;


export interface ICreateTicketPayload {
  assetTag?: string;
  employeeNik?: string;
  userNonEmployeeName?: string;
  engineerId?: number;
  problem: string;
  slaPolicyId?: number;
  locationId?: number;
  solution?: string;
  backupAssetTag?: string;
  startAt?: string;
  solvedAt?: string | null;
  remarks?: string;
  fullNumberTemplate?: string;
  contact?: string;
}

export interface IUpdateTicketPayload extends Partial<ICreateTicketPayload> {
  status?: TicketStatusType;
  solution?: string;
}


export type IPrintTicketPayload = {
  // engineerId: number;
  supervisorId: number;
  // date: string;
}

export interface ITicketRepository {
  getAll: (filter?: ITicketFilters) => Promise<ISuccessResponse<ITicket[]>>
  getDashboardTickets: (filter?: ITicketFilters) => Promise<ISuccessResponse<ITicket[]>>
  getTicketSummary: () => Promise<ITicketSummary>
  getTicketTrend: (range?: 'week' | 'month' | 'year') => Promise<IChartData[]>
  getTicketsByEmployeeId: (employeeId: number) => Promise<ITicket[]>
  getTicketById: (id: number) => Promise<ITicket>

  createTicket: (ticket: ICreateTicketPayload) => any
  generateTicketPdf: (id: number, payload: IPrintTicketPayload) => Promise<void>
  claimTicket: (id: number) => any
  updateTicket: (id: number, ticket: IUpdateTicketPayload) => any
  getSolvedTicketPdf: (id: number) => void
  uploadTicket: (id: number, file: File) => Promise<void>

  hardRemoveTicket: (id: number) => any
}
