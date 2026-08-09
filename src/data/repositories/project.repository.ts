import {delay} from "../../helper/helper.tsx";
import type {IProject, IProjectPayload, IProjectRepository} from "@/types/project.type.ts";
import api from "../api/interceptors.ts";


const projectLocal: IProjectRepository = {
    getAll: async (): Promise<IProject[]> => {
	await delay();
	console.log('masukLocal')
	return [] as IProject[];
    },
    getById: async (id: number | string): Promise<IProject> => {
	await delay();
	console.log('masukLocal', id)
	return {} as IProject;
    },
    create: async (payload: IProjectPayload): Promise<IProject> => {
	await delay();
	console.log('masukLocal', payload)
	return {} as IProject;
    },
    update: async (id: number | string, payload: IProjectPayload): Promise<IProject> => {
	await delay();
	console.log('masukLocal', id, payload)
	return {} as IProject;
    },
    remove: async (id: number | string) => {
	await delay();
	console.log('masukLocal', id)
    }
}


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
}


const createProjectRepository = () => {

    const dataMode = import.meta.env.VITE_DATA_MODE || 'local';
    return dataMode === 'api' ? projectApi : projectLocal;
};

export const ProjectRepository = createProjectRepository();