export interface IAssetCategory {
    id: number;
    name: string;
    description: string;
}

export interface ICreateAssetCategoryDto {
    name: string;
    description: string;
}

export interface IAssetCategoryRepository {
    getAll: () => Promise<IAssetCategory[]>;
    getById: (id: number | string) => Promise<IAssetCategory>;
    create: (payload: ICreateAssetCategoryDto) => Promise<IAssetCategory>;
    update: (id: number | string, payload: ICreateAssetCategoryDto) => Promise<IAssetCategory>;
    remove: (id: number | string) => Promise<void>;
}