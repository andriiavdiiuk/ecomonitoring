import api from "frontend/services/api.ts";
import {type Measurement} from "common/entities/Measurement.ts";
import type {MeasurementStats, MeasurementThreshold, PaginationResult} from "common/Results.ts";
import {type GetMeasurementDTO, type MeasurementFilterDTO} from "common/validation/schemas/measurementSchemas.ts";

class measurementService {
    public async getMeasurements(params?: GetMeasurementDTO): Promise<PaginationResult<Measurement[]>> {
        const response = await api.get<PaginationResult<Measurement[]>>("/measurements", {params});
        return response.data;
    }

    public async getStatistics(params?: MeasurementFilterDTO): Promise<MeasurementStats> {
        const response = await api.get<MeasurementStats>(`/measurement/statistics/`, {params});
        return response.data;
    }

    public async getMeasurement(id: string): Promise<Measurement> {
        const response = await api.get<Measurement>(`/measurement/${id}`);
        return response.data;
    }

    public async createMeasurement(measurement: Partial<Measurement>): Promise<MeasurementThreshold>{
        const response = await api.post<MeasurementThreshold>(`/measurement`, measurement);
        return response.data;
    }

    public async updateMeasurement(measurement: Partial<Measurement>):  Promise<MeasurementThreshold> {

        if (measurement._id) {
            const response = await api.put<MeasurementThreshold>(`/measurement/${measurement._id}`, measurement);

            return response.data;
        }
        throw new Error("Undefined measurement id");
    }

    public async deleteMeasurement(id: string): Promise<boolean> {
        const response = await api.delete<boolean>(`/measurement/${id}`);
        return response.data;
    }
}

export default new measurementService();