import type {IChartData} from "./common.type.ts";
import type {IAsset} from "./asset.type.ts";

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
  startAt: string;
  solvedAt?: string;
  remarks?: string;
  createdAt: string;
  asset?: IAsset
  engineer?: {
    fullName: string;
    role: 'admin' | 'engineer' | 'user' | string;
  };
  employee?: {
    id: number;
    name: string;
    nik: string;
    position: string;
    department: string;
  };
  createdBy: {
    fullName: string;
    role: 'admin' | 'engineer' | 'user' | string;
  };
  slaPolicy: {
    id: number;
    name: string;
    description: string;
    responseTimeSeconds: number;
    resolutionTimeSeconds: number;
    isBusinessHourOnly: boolean;
  };
  location: {
    id: number;
    name: string;
  };
}

export type ITicketForAsset = Omit<ITicket,  'employee' | 'slaPolicy' |
    'asset' |
    'location' |
    'remarks' |
    'createdBy'>;

export interface ITicketRepository {
  getAllTickets: () => Promise<ITicket[]>
  getTicketSummary: () => Promise<ITicketSummary>
  getTicketTrend: (range?: 'week' | 'month' | 'year') => Promise<IChartData[]>
  getTicketsByEmployeeId: (employeeId: number) => Promise<ITicket[]>
  getTicketById: (id: number) => Promise<ITicket>
}
