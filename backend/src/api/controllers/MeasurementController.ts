import {Request, Response} from "express";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import MeasurementService from "backend/bll/services/MeasurementService";
import {
    GetMeasurementDTO,
    GetMeasurementsSchema, MeasurementDTO,
    MeasurementFilterDTO,
    MeasurementFilterSchema,
    MeasurementIdParamsSchema,
    MeasurementSchema,
    UpdateMeasurementSchema,
} from "backend/bll/validation/schemas/measurementSchemas";
import {Measurement} from "backend/dal/entities/Measurement";

export default class MeasurementController {
    private readonly measurementService: MeasurementService

    constructor(measurementService: MeasurementService) {
        this.measurementService = measurementService;
    }

    async getMeasurements(req: Request, res: Response, getMeasurementDto:GetMeasurementDTO): Promise<Response> {
        const measurements = await this.measurementService.getMeasurements(getMeasurementDto);

        return res.json(measurements);
    }

    async getMeasurementById(req: Request, res: Response, id: string): Promise<Response> {
        const measurement = await this.measurementService.getMeasurement(id);

        if (!measurement) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        return res.status(200).json(measurement);
    }

    async createMeasurement(req: Request, res: Response, measurementData: Measurement): Promise<Response> {
        const measurement = await this.measurementService.createMeasurement(measurementData);
        const thresholds = this.measurementService.checkThresholds(measurement);
        return res.status(201).json({measurement:measurement, thresholds:thresholds});

    }

    async updateMeasurement(req: Request, res: Response,measurementData: Measurement): Promise<Response> {
        const measurement = await this.measurementService.updateMeasurement(measurementData);

        if (!measurement) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        const thresholds = this.measurementService.checkThresholds(measurementData);
        return res.status(201).json({measurement:measurement, thresholds:thresholds});

    }

    async deleteMeasurement(req: Request, res: Response, id: string): Promise<Response> {
        const deleted = await this.measurementService.deleteMeasurement(id);

        if (!deleted) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        return res.status(200).json();
    }

    async getLatest(req: Request, res: Response): Promise<Response> {
        return res.status(200).json(await this.measurementService.getLatest());
    }

    async getStatistics(req: Request, res: Response, measurementFilter: MeasurementFilterDTO): Promise<Response> {
        const stats = await this.measurementService.getStatistics(measurementFilter);
        return res.status(200).json(stats)
    }
}