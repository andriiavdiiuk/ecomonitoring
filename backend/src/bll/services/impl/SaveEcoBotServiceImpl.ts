import SaveEcoBotService, {SyncEcoBotResult} from "backend/bll/services/SaveEcoBotService";
import Station from "backend/dal/entities/Station";
import {AveragingPeriod, MeasuredParameters, Pollutant, QualityFlag, Unit} from "backend/dal/entities/Pollutant";
import StationRepository from "backend/dal/repositories/StationRepository";
import {Measurement} from "backend/dal/entities/Measurement";
import MeasurementRepository from "backend/dal/repositories/MeasurementRepository";

type SaveEcoBotPollutant = {
    pol: MeasuredParameters;
    unit: Unit;
    value: number | null;
    averaging: AveragingPeriod;
    time: string;
};

type SaveEcoBotStationData = {
    id: string;
    cityName: string;
    stationName: string;
    localName?: string;
    timezone: string;
    longitude: string;
    latitude: string;
    platformName: string;
    pollutants: SaveEcoBotPollutant[];
};


export default class SaveEcoBotServiceImpl implements SaveEcoBotService {
    private readonly apiUrl: string = 'https://api.saveecobot.com/output.json';
    private readonly stationRepository: StationRepository;
    private readonly measurementRepository: MeasurementRepository;

    constructor(stationRepository: StationRepository, measurementRepository: MeasurementRepository) {
        this.stationRepository = stationRepository
        this.measurementRepository = measurementRepository
    }

    public async sync(): Promise<SyncEcoBotResult> {
        const results: SyncEcoBotResult = {
            stations_processed: 0,
            stations_created: 0,
            stations_updated: 0,
            measurements_created: 0,
            errors: []
        };

        console.log('Starting SaveEcoBot data sync...');
        const response = await fetch(this.apiUrl);

        if (!response.ok) throw new Error(`SaveEcoBot API error: ${response.statusText}`);
        const saveEcoBotData: SaveEcoBotStationData[] = await response.json() as SaveEcoBotStationData[];

        for (const stationData of saveEcoBotData) {
            try {
                results.stations_processed++;

                const stationInfo: Partial<Station> = {
                    station_id: stationData.id,
                    city_name: stationData.cityName,
                    station_name: stationData.stationName,
                    local_name: stationData.localName || '' as string,
                    timezone: stationData.timezone,
                    geolocation: {
                        type: 'Point',
                        coordinates: [parseFloat(stationData.longitude), parseFloat(stationData.latitude)]
                    },
                    platform_name: stationData.platformName,
                    measured_parameters: stationData.pollutants.map(p => p.pol)
                };
                const station: Station | null = await this.stationRepository.findOneBy({station_id: stationInfo.station_id})
                if (!station) {
                    await this.stationRepository.create(stationInfo);
                    results.stations_created++;
                } else {
                    await this.stationRepository.update(<string>stationInfo.station_id, stationInfo);
                    results.stations_updated++;
                }

                const measurementGroups: Record<string, Partial<Measurement>> = {};
                stationData.pollutants.forEach((p: SaveEcoBotPollutant) => {
                    if (p.time && p.value != null) {
                        const key = p.time;
                        measurementGroups[key] ??= {
                            measurement_time: new Date(p.time),
                            pollutants: []
                        };
                        (measurementGroups[key].pollutants as Pollutant[]).push({
                            pollutant: p.pol,
                            value: p.value,
                            unit: p.unit,
                            averaging_period: p.averaging,
                            quality_flag: QualityFlag.Valid
                        });
                    }
                });

                for (const measurementGroup of Object.values(measurementGroups)) {
                    const existingMeasurement = await this.measurementRepository.findOneBy({
                        station_id: stationInfo.station_id,
                        measurement_time: measurementGroup.measurement_time,
                    });

                    if (!existingMeasurement && (measurementGroup.pollutants as Pollutant[]).length > 0) {
                        const measurement: Partial<Measurement> = {
                            station_id: <string>stationInfo.station_id,
                            measurement_time: measurementGroup.measurement_time as Date,
                            pollutants: measurementGroup.pollutants as Pollutant[],
                            metadata: {
                                source: 'SaveEcoBot',
                                original_data: stationData,
                                import_time: new Date()
                            }
                        };
                        await this.measurementRepository.create(measurement);
                        results.measurements_created++;
                    }
                }

                if (station) {
                    await this.stationRepository.updateLastMeasurement(station.station_id);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    results.errors.push({station_id: stationData.id, error: error.message});
                }
            }
        }
        return results;


    }
}