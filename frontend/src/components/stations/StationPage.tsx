import {generatePath, useParams} from "react-router";
import React, {type JSX, useEffect, useState} from "react";
import stationService from "frontend/services/StationService.ts";
import measurementService from "frontend/services/MeasurementService.ts";
import DataTable, {type TableRowData} from "frontend/components/table/DataTable.tsx";
import styles from './StationPage.module.scss';
import Pagination from "frontend/components/table/Pagination.tsx";
import SelectField from "frontend/components/input/SelectField.tsx";
import InputField from "frontend/components/input/InputField.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
import AppRoutes from "frontend/AppRoutes.tsx";
import {Link, useNavigate} from "react-router-dom";
import type Station from "common/entities/Station.ts";
import type {Measurement} from "common/entities/Measurement.ts";
import {MeasuredParameters} from "common/entities/Pollutant.ts";
import type {PaginationResult} from "common/Results.ts";
import HealthRiskLevel from "frontend/components/health_risk/HealthRiskLevel.tsx";
import {getCDIlevel, getCRlevel, getHQlevel} from "frontend/components/health_risk/HealthRiskLevels.ts";

interface Search {
    pollutant: string,
    start_date: string,
    end_date: string,
}

export default function StationPage(): JSX.Element {
    const {id} = useParams<{ id: string }>() as { id: string };
    const [station, setStation] = useState<Station | null>(null);
    const [measurements, setMeasurements] = useState<PaginationResult<Measurement[]>>();
    const [expandedPollutants, setExpandedPollutants] = useState<Set<string>>();
    const [tableData, setTableData] = useState<TableRowData[]>([]);
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

                    const mapped: TableRowData[] = res.data.map(m => {
                        let edit: string | JSX.Element = '';

                        if (userContext.user?.isRole('admin')) {
                            const path = generatePath(AppRoutes.EditMeasurement, {
                                station_id: id,
                                measurement_id: m._id,
                            })

                            edit = <Link to={path}>Edit</Link>;
                        }

                        return {
                            row: [
                                new Date(m.measurement_time).toLocaleString(),
                                m.pollutants.map(p => p.pollutant).join(", "),
                                ...(edit ? [edit] : []),
                            ],
                            rowId: m._id
                        };
                    });

                    setTableData(mapped);
                })
                .catch((err: unknown) => {
                    console.error(err);
                    setTableData([]);
                });
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [id, currentPage, search, userContext.user]);


    useEffect(() => {
        if (!expandedPollutants || !measurements) return;

        setTableData(prev =>
            prev.map(rowData => {
                const id = rowData.rowId;
                if (id && expandedPollutants.has(id)) {
                    const measurement = measurements.data.find(m => m._id === id);
                    if (!measurement) return {...rowData, afterRow: undefined};

                    return {
                        ...rowData,
                        afterRow: (
                            <div className={styles.expanded}>
                                {measurement.pollutants.map(p => (
                                    <div key={p.pollutant} className={styles.item}>
                                        <span className={styles.pollutant}>
                                            <strong>{p.pollutant}</strong>: {String(p.value)} {p.unit}
                                        </span>
                                        {p.health_risk && (
                                            <div className={styles.health_risk}>
                                                <HealthRiskLevel label={"CDI"} value={p.health_risk.CDI} getLevel={getCDIlevel}/>
                                                <HealthRiskLevel label={"CR"} value={p.health_risk.CR} getLevel={getCRlevel}/>
                                                <HealthRiskLevel label={"HQ"} value={p.health_risk.HQ} getLevel={getHQlevel}/>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        )
                    };
                }
                return {...rowData, afterRow: undefined};
            })
        );
    }, [expandedPollutants, measurements]);


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

    const header = ["Time", "Pollutants"];

    if (userContext.user?.isRole('admin')) {
        header.push('Controls');
    }

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const handleRowClick = (_row: (string | JSX.Element)[], _index: number, id: string | null): void => {
        if (!id) return;
        setExpandedPollutants(prev => {
            const next = new Set(prev ?? []);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

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

                <p><strong>Status:</strong> {station.status}</p>


                <p>
                    <strong>Coordinates:</strong>{" "}
                    {station.geolocation.coordinates[1]}, {station.geolocation.coordinates[0]}
                </p>


                {
                    (station.measured_parameters).length > 0 && (
                        <p>
                            <strong>Measured parameters:</strong> {station.measured_parameters.join(", ")}
                        </p>
                    )
                }
            </section>

            <section>
                <h2>Measurements</h2>

                {userContext.user?.isRole("admin") &&
                    <div className={styles.controls}>
                        <Link className={styles.button} to={AppRoutes.NewMeasurement.replace(':station_id', id)}>Add
                            Measurement</Link>
                    </div>
                }

                <div className={styles.search}>

                    <SelectField className={styles.search_field}
                                 label="Pollutant"
                                 name='pollutant'
                                 value={search.pollutant}
                                 onChange={handleChange}>
                        <option value="">Pollutant</option>
                        {Object.values(MeasuredParameters).map((param) => (
                            <option key={param} value={param}>
                                {param}
                            </option>
                        ))}
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
                    handleRowClick={handleRowClick}
                />

                <Pagination
                    currentPage={measurements?.pagination.page || 0}
                    totalPages={measurements?.pagination.pages || 0}
                    onPageChange={onPageChange}
                />
            </section>
        </div>
    );
}