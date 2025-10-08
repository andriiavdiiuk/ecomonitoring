import api from "frontend/services/api.ts";

interface GeoLocation {
    type: string
    coordinates: [number, number]
}

export interface Metadata {
    data_source?: string
    created_at?: string
    updated_at?: string
    last_measurement?: string
}

export interface Station {
    geolocation?: GeoLocation
    metadata?: Metadata
    _id?: string
    station_id?: string
    city_name?: string
    station_name?: string
    local_name?: string
    timezone?: string
    platform_name?: string
    status?: string
    measured_parameters?: string[]
}


export interface StationResponse {
    stations: Station[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface getStations {
    city?: string;
    limit?: number;
    status?: string;
    page?: number;
}

class StationService {
    public async getStations(params?: getStations ): Promise<StationResponse> {
        const response = await api.get<StationResponse>("/stations", {params});
        return response.data;
    }

    public async getStation(station_id:string): Promise<Station>{
        const response = await api.get<Station>(`/station/${station_id}`);
        return response.data;
    }

    public async createStation(station: Station): Promise<Station> {
        const response = await api.post<Station>(`/station`, station);
        return response.data;
    }
    public async updateStation(station: Station): Promise<Station> {
        const response = await api.put<Station>(`/station/${String(station.station_id)}`, station);
        return response.data;
    }
    public async deleteStation(station_id: string): Promise<boolean> {
        const response = await api.delete<boolean>(`/station/${station_id}`);
        return response.data;
    }
}

export default new StationService();