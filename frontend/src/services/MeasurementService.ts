import api from "frontend/services/api.ts";

export interface Measurement {
    metadata: MeasurementMetadata;
    _id: string;
    station_id: string;
    status: string;
    measurement_time: string;
    pollutants: Pollutant[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface MeasurementMetadata {
    source: string;
    import_time: string;
    original_data: OriginalData;
}

export interface OriginalData {
    id: string;
    cityName: string;
    stationName: string;
    localName: string;
    timezone: string;
    latitude: string;
    longitude: string;
    pollutants: OriginalPollutant[];
    platformName: string;
}

export interface OriginalPollutant {
    pol: string;
    unit: string;
    time: string;
    value: number;
    averaging: string;
}

export interface Pollutant {
    pollutant: string;
    value: number;
    unit: string;
    averaging_period: string;
    quality_flag: string;
}

export interface MeasurementResponse {
    measurement: Measurement[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface getMeasurements {
    station_id?:string,
    start_date?: string,
    end_date?: string,
    pollutant?: string,
    limit?: number,
    page?: number,
}

interface getStatistics {
    station_id?:string,
    start_date?: string,
    end_date?: string,
    pollutant?: string,
}

export interface measurementStatistics {
    count:number,
    avg: number,
    min: number,
    max: number
}

class measurementService {
    public async getMeasurements(params?: getMeasurements ): Promise<MeasurementResponse> {
        const response = await api.get<MeasurementResponse>("/measurements", {params});
        return response.data;
    }

    public async getStatistics(params?: getStatistics): Promise<measurementStatistics>
    {
        const response = await api.get<measurementStatistics>(`/measurement/statistics/`,{params});
        return response.data;
    }

    public async getMeasurement(id:string): Promise<Measurement>{
        const response = await api.get<Measurement>(`/measurement/${id}`);
        return response.data;
    }
}

export default new measurementService();