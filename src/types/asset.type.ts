export interface IAssetSummary {
    nb: number;
    mws: number;
    pc: number;
    ws: number;
}

export interface IAssetRepository {
    getAssetSummary: () => Promise<IAssetSummary>
}