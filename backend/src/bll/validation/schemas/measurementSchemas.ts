import {AveragingPeriod, MeasuredParameters, Pollutant, QualityFlag, Unit} from "backend/dal/entities/Pollutant";
import {z} from "zod";
import {Status} from "backend/dal/entities/Station";

export const MetadataSchema = z.object({
    source: z.string(),
    import_time: z.coerce.date().optional(),
    original_data: z.any().optional(),
    processing_notes: z.string().optional()
});

export const PollutantSchema = z.object({
    pollutant: z.enum(MeasuredParameters),
    value: z.number(),
    unit: z.enum(Unit),
    averaging_period: z.enum(AveragingPeriod),
    quality_flag: z.enum(QualityFlag),
});

export const MeasurementSchema = z.object({
    id: z.string().optional(),
    station_id: z.string(),
    status: z.enum(Status),
    measurement_time: z.coerce.date(),
    pollutants: z.array(PollutantSchema),
    metadata: MetadataSchema.optional(),
});

export const UpdateMeasurementSchema = MeasurementSchema
    .omit({id: true});


export const GetMeasurementsSchema = z.object({
    station_id: z.string().optional(),
    start_date: z.coerce.date().optional(),
    end_date: z.coerce.date().optional(),
    pollutant: z.enum(MeasuredParameters).optional(),
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
});

export const MeasurementFilterSchema = z.object({
    station_id: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    pollutant: z.enum(MeasuredParameters),
});

export const MeasurementIdParamsSchema = z.object({
    id: z.string()
});


export type MeasurementDTO = z.infer<typeof MeasurementSchema>;
export type UpdateMeasurementDTO = z.infer<typeof UpdateMeasurementSchema>;
export type GetMeasurementDTO = z.infer<typeof GetMeasurementsSchema>;
export type MeasurementFilterDTO = z.infer<typeof MeasurementFilterSchema>;
export type MeasurementIdParamsDTO = z.infer<typeof MeasurementIdParamsSchema>;