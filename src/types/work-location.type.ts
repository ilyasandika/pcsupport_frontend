export interface IDetailWorkLocation {
    id: number;
    name: string;
    description: string;
    address: string;
    longitude: number;
    latitude: number;
}

export type IWorkLocation = Pick<IDetailWorkLocation, 'id' | 'name'>;

export interface ICreateWorkLocationDto {
    name: string;
    description: string;
    address: string;
    longitude: number;
    latitude: number;
}

export interface IWorkLocationRepository {
    getAll: () => Promise<IDetailWorkLocation[]>
    getById: (id: number | string) => Promise<IDetailWorkLocation>;
    create: (payload: ICreateWorkLocationDto) => Promise<IDetailWorkLocation>;
    update: (id: number | string, payload: ICreateWorkLocationDto) => Promise<IDetailWorkLocation>;
    remove: (id: number | string) => Promise<void>;
}