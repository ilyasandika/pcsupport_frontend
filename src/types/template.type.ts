export const TemplateType = {
    Ticket: 'ticket',
    BastAssign: 'bast_assign',
    BastReturn: 'bast_return',
    BastBackup: 'bast_backup',
} as const;

export type TemplateType = typeof TemplateType[keyof typeof TemplateType];

export interface ITemplate {
    id: number;
    type: TemplateType;
    name: string;
    filePath: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface IUploadTemplatePayload {
    type: TemplateType;
    description?: string;
    file: File;
}

export interface ITemplateRepository {
    getAll: () => Promise<ITemplate[]>;
    getById: (id: number | string) => Promise<ITemplate>;
    upload: (payload: IUploadTemplatePayload) => Promise<ITemplate>;
    remove: (id: number | string) => Promise<void>;
    downloadDocument: (id: number | string, fileName?: string) => Promise<void>;
    getDocumentBlob: (id: number | string) => Promise<Blob>;
}