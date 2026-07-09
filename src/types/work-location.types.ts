export interface IDetailWorkLocation {
    id: number;
    name: string;
    description: string;
    address: string;
    longitude: number;
    latitude: number;
}

export type IWorkLocation = Pick<IDetailWorkLocation, 'id' | 'name'>;

export interface IWorkLocationRepository {
    getLocations: () => Promise<IDetailWorkLocation[]>
}