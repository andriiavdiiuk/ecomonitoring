export type SyncEcoBotResult = {
    stations_processed: number;
    stations_created: number;
    stations_updated: number;
    measurements_created: number;
    errors: { station_id: string; error: string }[];
}


export default interface SaveEcoBotService {
    sync(): Promise<SyncEcoBotResult>
}