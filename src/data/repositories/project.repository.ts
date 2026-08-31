import { delay } from "../../helper/helper.tsx";
import type { IProject, IProjectPayload, IProjectRepository } from "@/types/project.type.ts";
import api from "../api/interceptors.ts";

let mockProjects: IProject[] = [
    {
        id: 1,
        name: "Pengadaan Laptop PC Operational 2025",
        description: "Pengadaan unit laptop dan desktop untuk kebutuhan operasional unit Tanjung Enim",
        vendorId: 1,
        vendor: { id: 1, name: "PT Lenovo Indonesia" },
    },
    {
        id: 2,
        name: "Server Infrastructure Modernization",
        description: "Upgrade server rack dan storage data center pusat",
        vendorId: 2,
        vendor: { id: 2, name: "PT Dell Indonesia" },
    },
];

const projectLocal: IProjectRepository = {
    getAll: async (): Promise<IProject[]> => {
        await delay();
        return [...mockProjects];
    },
    getById: async (id: number | string): Promise<IProject> => {
        await delay();
        const project = mockProjects.find(p => String(p.id) === String(id) || p.name === String(id));
        if (!project) throw new Error(`Project with id ${id} not found`);
        return { ...project };
    },
    create: async (payload: IProjectPayload): Promise<IProject> => {
        await delay();
        const newProject: IProject = {
            id: Date.now(),
            name: payload.name,
            description: payload.description,
            vendorId: payload.vendorId,
        };
        mockProjects.push(newProject);
        return { ...newProject };
    },
    update: async (id: number | string, payload: IProjectPayload): Promise<IProject> => {
        await delay();
        const index = mockProjects.findIndex(p => String(p.id) === String(id) || p.name === String(id));
        if (index === -1) throw new Error(`Project with id ${id} not found`);
        mockProjects[index] = {
            ...mockProjects[index],
            name: payload.name,
            description: payload.description,
            vendorId: payload.vendorId,
        };
        return { ...mockProjects[index] };
    },
    remove: async (id: number | string) => {
        await delay();
        mockProjects = mockProjects.filter(p => String(p.id) !== String(id) && p.name !== String(id));
    }
};

const projectApi: IProjectRepository = {
    getAll: async (): Promise<IProject[]> => {
        const res = await api.get('/projects');
        return res.data;
    },
    getById: async (id: number | string): Promise<IProject> => {
        const res = await api.get(`/projects/${id}`);
        return res.data;
    },
    create: async (payload: IProjectPayload): Promise<IProject> => {
        const res = await api.post('/projects', payload);
        return res.data;
    },
    update: async (id: number | string, payload: IProjectPayload): Promise<IProject> => {
        const res = await api.patch(`/projects/${id}`, payload);
        return res.data;
    },
    remove: async (id: number | string) => {
        return await api.delete(`/projects/${id}`);
    }
};

const createProjectRepository = () => {
    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? projectApi : projectLocal;
};

export const ProjectRepository = createProjectRepository();