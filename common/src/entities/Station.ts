import {MeasuredParameters} from "common/entities/Pollutant";

export enum Status {
    Active = 'active',
    Inactive = 'inactive',
    Maintenance = 'maintenance',
}

export default interface Station{
    station_id: string,
    city_name: string,
    station_name: string,
    local_name: string,
    timezone: string,
    geolocation: {
        type: string,
        coordinates: [number, number],
    },
    platform_name: string,
    status: Status,
    measured_parameters: MeasuredParameters[],
    metadata: {
        created_at: Date
        updated_at: Date
        data_source: string
        last_measurement: Date
    }
}