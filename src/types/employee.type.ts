export interface IEmployee {
    id: number;
    nik: string;
    name: string;
    contractType: 'organik' | 'pkwt';
    position: string;
    positionId: string;
    fs: string;
    mjl: string;
    bod: string;
    religion: string;
    directorate: string;
    division: string;
    department: string;
    status?: boolean;
    retireDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IEmployeeRepository {
    getEmployees: () => Promise<IEmployee[]>
}
