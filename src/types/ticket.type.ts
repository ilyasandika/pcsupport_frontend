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
  id: number,
  fullNumber: string,
  asset?: {
    id: number,
    serialNumber: string,
    assetTag: string,
    hostname: string,
    category: 'nb' | 'mws' | 'pc' | 'ws',
    brand: string,
    model: string,
  }
  engineer?: {
    id: number,
    username: string,
    email: string,
    role: 'admin' | 'engineer' | 'helpdesk',
  }
  user?: {
    employeeId: number,
    nik: string,
    name: string,
    userNonEmployee?: string,
  }
  createdBy: {
    id: number,
    username: string,
    email: string,
    role: string,
  }
  sla: {
    id: number,
    name: 'P1' | 'P2' | 'P3',
    description: string,
    resolutionTime: number,
    responseTime: number,
  }
  location: {
    id: number,
    name: string // TJE | TRH | JKT | PLG | KRTP,
  },

  problem: string,
  status: TicketStatusType,
  solution?: string,
  startAt: string,
  solvedAt?: string,
  remarks?: string,
}

export interface ITicketRepository {
  getAllTickets: () => Promise<ITicket[]>
  getTicketSummary: () => Promise<ITicketSummary>
  getTicketTrend: (range?: 'week' | 'month' | 'year') => Promise<IChartData[]>
  getTicketsByEmployeeId: (employeeId: number) => Promise<ITicket[]>
}
