import type {IChartData} from "./common.type.ts";

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
  asset?: {
    serialNumber: string;
    assetTag: string;
    hostname: string;
    category: 'nb' | 'mws' | 'ws' | 'pc';
    assetAssigment: {
      name: string;
      nik: string;
      userNonEmployeeName?: string;
    };
  };
  engineer?: {
    fullName: string;
    role: 'admin' | 'engineer' | 'user' | string;
  };
  employee?: {
    name: string;
    nik: string;
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
    name: string;
  };
}
export interface ITicketRepository {
  getAllTickets: () => Promise<ITicket[]>
  getTicketSummary: () => Promise<ITicketSummary>
  getTicketTrend: (range?: 'week' | 'month' | 'year') => Promise<IChartData[]>
  getTicketsByEmployeeId: (employeeId: number) => Promise<ITicket[]>
}
