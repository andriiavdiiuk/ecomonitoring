import {Request, Response} from "express";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import MeasurementService from "backend/bll/services/MeasurementService";
import {
    GetMeasurementDTO,
    GetMeasurementsSchema,
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

    async getMeasurements(req: Request, res: Response): Promise<Response> {
        const filter: GetMeasurementDTO =  GetMeasurementsSchema.parse(req.query);

        const measurements = await this.measurementService.getMeasurements(filter);

        return res.json(measurements);
    }

    async getMeasurementById(req: Request, res: Response): Promise<Response> {
        const {id} = MeasurementIdParamsSchema.parse(req.params);
        const measurement = await this.measurementService.getMeasurement(id);

        if (!measurement) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        return res.status(200).json(measurement);
    }

    async createMeasurement(req: Request, res: Response): Promise<Response> {
        const measurementData =  MeasurementSchema.parse(req.body) as Measurement;

        const measurement = await this.measurementService.createMeasurement(measurementData);
        const thresholds = this.measurementService.checkThresholds(measurement);
        return res.status(201).json({measurement:measurement, thresholds:thresholds});

    }

    async updateMeasurement(req: Request, res: Response): Promise<Response> {
        const {id} = MeasurementIdParamsSchema.parse(req.params);
        const updateData =  UpdateMeasurementSchema.parse(req.body) as Measurement;

        updateData.station_id = id;

        const measurement = await this.measurementService.updateMeasurement(updateData);

        if (!measurement) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        const thresholds = this.measurementService.checkThresholds(updateData);
        return res.status(201).json({measurement:measurement, thresholds:thresholds});

    }

    async deleteMeasurement(req: Request, res: Response): Promise<Response> {
        const {id} = MeasurementIdParamsSchema.parse(req.params);

        const deleted = await this.measurementService.deleteMeasurement(id);

        if (!deleted) {
            sendProblemDetail(req, res, 404, "Measurement not found")
        }

        return res.status(200).json();
    }

    async getLatest(req: Request, res: Response): Promise<Response> {
        return res.status(200).json(await this.measurementService.getLatest());
    }

    async getStatistics(req: Request, res: Response): Promise<Response> {
        const measurementFilter: MeasurementFilterDTO = MeasurementFilterSchema.parse(req.query);
        const stats = await this.measurementService.getStatistics(measurementFilter);
        return res.status(200).json(stats)
    }
}