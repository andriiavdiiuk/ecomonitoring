import {AveragingPeriod, MeasuredParameters, Pollutant, QualityFlag, Unit} from "common/entities/Pollutant";
import {Measurement} from "common/entities/Measurement";
import Station, {Status} from "common/entities/Station";
import StationRepositoryImpl from "backend/dal/repositories/impl/StationRepositoryImpl";
import {MeasurementRepositoryImpl} from "backend/dal/repositories/impl/MeasurementRepositoryImpl";
import connectDB from "backend/api/configuration/database";
import {createDefaultConfig} from "backend/api/configuration/config";
import StationService from "backend/bll/services/StationService";
import {StationServiceImpl} from "backend/bll/services/impl/StationServiceImpl";
import {MeasurementServiceImpl} from "backend/bll/services/impl/MeasurementServiceImpl";
import mongoose from "mongoose";

function getRandomValue(param: MeasuredParameters): number {
    switch (param) {
        case MeasuredParameters.PM25:
            return parseFloat((Math.random() * 150).toFixed(2))

        case MeasuredParameters.PM10:
            return parseFloat((Math.random() * 200).toFixed(2))

        case MeasuredParameters.Temperature:
            return parseFloat((Math.random() * 40).toFixed(1)) // 0..40 °C, без мінусів

        case MeasuredParameters.Humidity:
            return parseFloat((Math.random() * 100).toFixed(1))

        case MeasuredParameters.Pressure:
            return parseFloat((Math.random() * 40 + 980).toFixed(1))

        case MeasuredParameters.AirQualityIndex:
            return Math.floor(Math.random() * 500)

        case MeasuredParameters.NO2:
            return parseFloat((Math.random() * 0.2).toFixed(3))

        case MeasuredParameters.SO2:
            return parseFloat((Math.random() * 0.2).toFixed(3))

        case MeasuredParameters.CO:
            return parseFloat((Math.random() * 10).toFixed(2))

        case MeasuredParameters.O3:
            return parseFloat((Math.random() * 0.2).toFixed(3))

        default:
            return 0
    }
}


function getUnit(param: MeasuredParameters): Unit {
    switch (param) {
        case MeasuredParameters.PM25:
        case MeasuredParameters.PM10:
            return Unit.UgPerM3
        case MeasuredParameters.Temperature:
            return Unit.Celcius
        case MeasuredParameters.Humidity:
            return Unit.Percent
        case MeasuredParameters.Pressure:
            return Unit.Hpa
        case MeasuredParameters.AirQualityIndex:
            return Unit.Aqi
        case MeasuredParameters.NO2:
        case MeasuredParameters.SO2:
        case MeasuredParameters.O3:
            return Unit.MgPerM3
        case MeasuredParameters.CO:
            return Unit.Ppm
        default:
            return Unit.UgPerM3
    }
}

function generatePollutant(param: MeasuredParameters): Pollutant {
    return {
        pollutant: param,
        value: getRandomValue(param),
        unit: getUnit(param),
        averaging_period: AveragingPeriod.OneHour,
        quality_flag: QualityFlag.Valid
    }
}

const STATION: Station = {
    station_id: "TEST_STATION",
    city_name: "Test",
    station_name: "Test Station",
    status: Status.Active,
    geolocation: {
        type: "Point",
        coordinates: [0,0],
    },
    metadata: {
        created_at: new Date(),
        updated_at: new Date(),
        data_source: "",
        last_measurement: new Date()
    },
    platform_name: "Test",
    timezone: "Test",
    local_name: "Test",
    measured_parameters: [],
}

function generateMeasurements(n: number, startTime: Date = new Date()): Measurement[] {
    const measurements: Measurement[] = []

    for (let i = 0; i < n; i++) {
        const measurementTime = new Date(startTime.getTime() + i * 60 * 60 * 1000)
        const pollutants: Pollutant[] = Object.values(MeasuredParameters).map(p => generatePollutant(p))

        measurements.push({
            _id: new mongoose.Types.ObjectId().toString(),
            station_id: STATION.station_id,
            status: Status.Active,
            measurement_time: measurementTime,
            pollutants,
            metadata: {
                source: 'test measurement',
                import_time: new Date()
            },
        })
    }
    return measurements
}

async function fillDatabase(n: number)
{
    const stationService: StationServiceImpl = new StationServiceImpl(new StationRepositoryImpl())
    const measurementService: MeasurementServiceImpl = new MeasurementServiceImpl(new MeasurementRepositoryImpl());

    const existingStation = await stationService.getStation(STATION.station_id);
    if(existingStation === null)
    {
        await stationService.createStation(STATION);
    }

    const measurements = generateMeasurements(n);
    for (const measurment of measurements) {
        await measurementService.createMeasurement(measurment);
    }

}

await connectDB(createDefaultConfig())
await fillDatabase(10);
