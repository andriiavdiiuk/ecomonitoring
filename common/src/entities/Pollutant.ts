import {type HealthRisk} from "common/entities/HealthRisk";

export enum MeasuredParameters {
    PM25 = 'PM2.5',
    PM10 = 'PM10',
    Temperature = 'Temperature',
    Humidity = 'Humidity',
    Pressure = 'Pressure',
    AirQualityIndex = 'Air Quality Index',
    NO = 'NO',
    NO2 = 'NO2',
    SO2 = 'SO2',
    CO = 'CO',
    CO2 = 'CO2',
    O3 = 'O3',
    NH3 = 'NH3',
    BenzoAPyrene = 'C20H12',
    Cd = 'Cd',
    CuO = 'CuO',
    As = 'As',
    NiO = 'NiO',
    Hg = 'Hg',
    SeO2 = 'SeO2',
    Pb = 'Pb',
    CrVI = 'Cr(VI)',
    ZnO = 'ZnO',
}

export enum Unit {
    UgPerM3 = 'ug/m3',
    Celcius = 'Celcius',
    Percent = '%',
    Hpa = 'hPa',
    Aqi = 'aqi',
    MgPerM3 = 'mg/m3',
    Ppm = 'ppm'
}

export enum AveragingPeriod {
    OneMinute = '1 minute',
    TwoMinutes = '2 minutes',
    FiveMinutes = '5 minutes',
    FifteenMinutes = '15 minutes',
    OneHour = '1 hour',
    TwentyFourHours = '24 hours'
}

export enum QualityFlag {
    Valid = 'valid',
    Invalid = 'invalid',
    Estimated = 'estimated',
    Preliminary = 'preliminary',
}

export interface Pollutant {
    pollutant: MeasuredParameters;
    value: number;
    unit: Unit
    averaging_period?: AveragingPeriod;
    quality_flag?: QualityFlag;
    health_risk?: HealthRisk;
}