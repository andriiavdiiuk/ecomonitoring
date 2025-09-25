export enum MeasuredParameters {
    PM25 = 'PM2.5',
    PM10 = 'PM10',
    Temperature = 'Temperature',
    Humidity = 'Humidity',
    Pressure = 'Pressure',
    AirQualityIndex = 'Air Quality Index',
    NO2 = 'NO2',
    SO2 = 'SO2',
    CO = 'CO',
    O3 = 'O3',
}

export enum Unit {
    UgPerM3 = 'ug/m3',
    Celsius = 'Celsius',
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
}