export interface IDetailWorkLocation {
    id: number;
    name: string;
    description: string;
    address: string;
    longitude: number;
    latitude: number;
}

export interface IWorkLocationRepository {
    getLocations: () => Promise<IDetailWorkLocation[]>
}