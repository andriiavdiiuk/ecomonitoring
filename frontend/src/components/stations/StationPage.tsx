import {generatePath, useParams} from "react-router";
import {type JSX, useEffect, useState} from "react";
import stationService, {type Station} from "frontend/services/StationService.ts";
import measurementService, {
    type Measurement,
    type MeasurementResponse,
} from "frontend/services/MeasurementService.ts";
import DataTable from "frontend/components/table/DataTable.tsx";
import styles from './StationPage.module.scss';
import Pagination from "frontend/components/table/Pagination.tsx";
import SelectField from "frontend/components/input/SelectField.tsx";
import InputField from "frontend/components/input/InputField.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
import AppRoutes from "frontend/AppRoutes.tsx";
import {Link, useNavigate} from "react-router-dom";

interface Search {
    pollutant: string,
    start_date: string,
    end_date: string,
}

export default function StationPage(): JSX.Element {
    const {id} = useParams<{ id: string }>() as { id: string };
    const [station, setStation] = useState<Station | null>(null);
    const [measurements, setMeasurements] = useState<MeasurementResponse>();
    const [tableData, setTableData] = useState<(string | JSX.Element)[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<Search>({pollutant: '', start_date: '', end_date: ''});
    const userContext = useUser();
    const navigate = useNavigate();
    useEffect(() => {

        stationService.getStation(id)
            .then((res) => {
                setStation(res)
            })
            .catch((err: unknown) => {
                console.error(err)
            });


    }, [id]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const params: Record<string, string> = {};

            if (search.pollutant.length > 0) params.pollutant = search.pollutant;
            if (search.start_date.length > 0) params.start_date = search.start_date;
            if (search.end_date.length > 0) params.end_date = search.end_date;

                measurementService.getMeasurements({station_id: id, page: currentPage, limit: 20, ...params})
                .then((res) => {
                    setMeasurements(res);
                    const mapped: (string | JSX.Element)[][] = [];
                    res.measurement.forEach((m: Measurement) => {
                        m.pollutants.forEach((p) => {
                            let edit: string | JSX.Element = '';
                            if (userContext.user?.isRole('admin'))
                            {
                                const path = generatePath(AppRoutes.EditMeasurement, {
                                    station_id: id,
                                    measurement_id: m._id,
                                })

                                edit = <Link to={path} >Edit</Link>;
                            }

                            mapped.push([
                                new Date(m.measurement_time).toLocaleString(),
                                p.pollutant,
                                `${String(p.value)} ${p.unit}`,
                                ...(edit ? [edit] : [])
                            ]);
                        });
                    });

                    setTableData(mapped);
                })
                .catch((err: unknown) => {
                    console.error(err);
                    setTableData([]);
                });


        }, 500);
        return () => {
            clearTimeout(handler)
        };
    }, [id, currentPage, search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const {name, value} = e.target;
        setSearch(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1);

    };

    const handleDelete = () => {
        stationService.deleteStation(id)
            .then(() => {
                void navigate(AppRoutes.Home);
            })
            .catch((err: unknown) => {
                console.log(err);
            })
    }

    const header = ["Time", "Pollutants", "Value"];

    if (userContext.user?.isRole('admin'))
    {
        header.push('Controls');
    }

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    };

    if (!station) return <p>Loading station...</p>;

    return (
        <div className={styles.table}>

            {userContext.user?.isRole("admin") &&
                <div className={styles.controls}>
                    <Link className={styles.button} to={AppRoutes.EditStation.replace(":id", id)}>Edit Station</Link>
                    <button className={styles.button_danger} onClick={handleDelete}>Delete Station</button>
                </div>
            }

            <section>
                <h1>{station.station_name}</h1>
                {station.city_name && <p><strong>City:</strong> {station.city_name}</p>
                }
                {
                    station.local_name && <p><strong>Local name:</strong> {station.local_name}</p>
                }
                {
                    station.status && <p><strong>Status:</strong> {station.status}</p>
                }
                {
                    station.geolocation?.coordinates && (
                        <p>
                            <strong>Coordinates:</strong>{" "}
                            {station.geolocation.coordinates[1]}, {station.geolocation.coordinates[0]}
                        </p>
                    )
                }
                {
                    (station.measured_parameters ?? []).length > 0 && (
                        <p>
                            <strong>Measured parameters:</strong> {station.measured_parameters?.join(", ")}
                        </p>
                    )
                }
            </section>

            <section>
                <h2>Measurements</h2>

                {userContext.user?.isRole("admin") &&
                    <div className={styles.controls}>
                        <Link className={styles.button} to={AppRoutes.NewMeasurement.replace(':station_id',id)}>Add Measurement</Link>
                    </div>
                }

                <div className={styles.search}>

                    <SelectField className={styles.search_field}
                                 label="Pollutant"
                                 name='pollutant'
                                 value={search.pollutant}
                                 onChange={handleChange}>
                        <option value="">Pollutant</option>
                        <option value="PM25">PM2.5</option>
                        <option value="PM10">PM10</option>
                        <option value="Temperature">Temperature</option>
                        <option value="Humidity">Humidity</option>
                        <option value="Pressure">Pressure</option>
                        <option value="AirQualityIndex">Air Quality Index</option>
                        <option value="NO2">NO2</option>
                        <option value="SO2">SO2</option>
                        <option value="CO">CO</option>
                        <option value="O3">O3</option>
                    </SelectField>
                    <InputField className={styles.search_field}
                                type="date"
                                name="start_date"
                                label="Start Date"
                                value={search.start_date}
                                onChange={handleChange}/>
                    <InputField className={styles.search_field}
                                type="date"
                                name="end_date"
                                label="End Date"
                                value={search.end_date}
                                onChange={handleChange}/>
                </div>

                <DataTable
                    data={tableData}
                    header={header}
                />
                <Pagination
                    currentPage={measurements?.pagination.page || 0}
                    totalPages={measurements?.pagination.pages || 0}
                    onPageChange={onPageChange}
                />
            </section>
        </div>
    )
        ;
}