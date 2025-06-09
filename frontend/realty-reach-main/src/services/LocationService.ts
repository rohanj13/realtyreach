import { backendApi } from '../api/backendApi';

export interface Region {
    name: string;
}

export interface State {
    name: string;
}

export interface LocationSearchResult {
    id: number;
    name: string;
    type: 'suburb' | 'region' | 'state';
    stateCode?: string;
}

export const LocationService = {
    getAllRegions: async (): Promise<string[]> => {
        const response = await backendApi.get('/api/Location/regions');
        console.log('Regions API Response:', response.data);
        return response.data;
    },

    getAllStates: async (): Promise<string[]> => {
        const response = await backendApi.get('/api/Location/states');
        console.log('States API Response:', response.data);
        return response.data;
    },

    searchLocations: async (query: string): Promise<LocationSearchResult[]> => {
        const response = await backendApi.get(`/api/Location/search?query=${encodeURIComponent(query)}`);
        return response.data;
    }
}; 