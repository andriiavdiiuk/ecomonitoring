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
                    const mapped: TableRowData[] = [];
                    res.data.forEach((m: Measurement) => {
                        m.pollutants.forEach((p) => {
                            let edit: string | JSX.Element = '';

                            if (userContext.user?.isRole('admin')) {
                                const path = generatePath(AppRoutes.EditMeasurement, {
                                    station_id: id,
                                    measurement_id: m._id,
                                })

                                edit = <Link to={path}>Edit</Link>;
                            }
                            const rowId = `${m._id},${p.pollutant}`;
                            mapped.push({
                                row: [
                                    new Date(m.measurement_time).toLocaleString(),
                                    p.pollutant,
                                    `${String(p.value)} ${p.unit}`,
                                    ...(edit ? [edit] : []),
                                ],
                                rowId: rowId
                            });
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
    }, [id, currentPage, search, userContext.user]);

    useEffect(() => {
        if (!expandedPollutants || !measurements) return;

        setTableData(prev =>
            prev.map(rowData => {
                const rowId = rowData.rowId;
                if (rowId && expandedPollutants.has(rowId)) {
                    const [measurementId, pollutantName] = rowId.split(',');
                    const measurement = measurements.data.find(m => m._id === measurementId);
                    if (!measurement) return { ...rowData, afterRow: undefined };
                    const pollutant = measurement.pollutants.find(p => p.pollutant.toString() === pollutantName && p.health_risk);
                    if (!pollutant) return { ...rowData, afterRow: undefined };
                    const formatValue = (num?: number) => {
                        if (num === undefined) return '';
                        return Number(num.toPrecision(3)).toString();
                    }

                    return {
                        ...rowData,
                        afterRow: (
                            <>
                                <p>Hazard Index (HI): {formatValue(pollutant.health_risk?.HI)}</p>
                                <p>Chronic Daily Intake (CDI): {formatValue(pollutant.health_risk?.CDI)}</p>
                            </>
                        )
                    };
                }
                return { ...rowData, afterRow: undefined };
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

    const header = ["Time", "Pollutants", "Value"];

    if (userContext.user?.isRole('admin')) {
        header.push('Controls');
    }

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    };

    const handleRowClick = (_row: (string | JSX.Element)[],_index: number, id: string | null): void => {
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
    )
        ;
}