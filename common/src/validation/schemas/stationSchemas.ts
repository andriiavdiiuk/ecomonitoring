import {z} from "zod";
import {MeasuredParameters} from "common/entities/Pollutant";
import {Status} from "common/entities/Station";


const GeolocationSchema = z.object({
    type: z.string().refine(val => val === 'Point', {
        message: "Geolocation type must be 'Point'"
    }),
    coordinates: z.tuple([z.number(), z.number()])
});

const MetadataSchema = z.object({
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    data_source: z.string(),
    last_measurement: z.coerce.date().optional(),
});

export const StationSchema = z.object({
    station_id: z.string(),
    city_name: z.string().min(1, "City name is required"),
    station_name: z.string().min(1, "Station name is required"),
    local_name: z.string().min(1, "Local name is required"),
    timezone: z.string().min(1, "Timezone is required"),
    geolocation: GeolocationSchema,
    platform_name: z.string().min(1, "Platform name is required"),
    status: z.enum(Status),
    measured_parameters: z.array(z.enum(MeasuredParameters)),
    metadata: MetadataSchema.optional(),
});
export const UpdateStationSchema = StationSchema
    .omit({station_id: true});


export const GetStationsQuerySchema = StationSchema.omit({
    metadata: true
}).partial().extend({
    page: z.coerce.number().optional(),
    limit: z.coerce.number().optional(),
})

export const StationIdParamsSchema = z.object({
    id: z.string()
});

export const NearbyStationsParamsSchema = z.object({
    longitude: z.coerce.number(),
    latitude: z.coerce.number(),
    maxDistance: z.coerce.number()
});

export type StationDTO = z.infer<typeof StationSchema>;
export type UpdateStationDTO = z.infer<typeof UpdateStationSchema>;
export type GetStationsDTO = z.infer<typeof GetStationsQuerySchema>
export type StationIdDTO = z.infer<typeof StationIdParamsSchema>
export type NearbyStationsDTO = z.infer<typeof NearbyStationsParamsSchema>
