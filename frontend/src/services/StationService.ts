import api from "frontend/services/api.ts";
import type Station from "common/entities/Station.ts";
import type {PaginationResult} from "common/Results.ts";
import type {GetStationsDTO} from "common/validation/schemas/stationSchemas.ts";

class StationService {
    public async getStations(params?: GetStationsDTO ): Promise<PaginationResult<Station[]>> {
        const response = await api.get<PaginationResult<Station[]>>("/stations", {params});
        return response.data;
    }

    public async getStation(station_id:string): Promise<Station>{
        const response = await api.get<Station>(`/station/${station_id}`);
        return response.data;
    }

    public async createStation(station: Partial<Station>): Promise<Station> {
        const response = await api.post<Station>(`/station`, station);
        return response.data;
    }
    public async updateStation(station: Partial<Station>): Promise<Station> {
        const response = await api.put<Station>(`/station/${station.station_id ?? ''}`, station);
        return response.data;
    }
    public async deleteStation(station_id: string): Promise<boolean> {
        const response = await api.delete<boolean>(`/station/${station_id}`);
        return response.data;
    }
}

export default new StationService();