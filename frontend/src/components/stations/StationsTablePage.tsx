import DataTable from "frontend/components/table/DataTable.tsx";
import stationService from "frontend/services/StationService.ts";
import {type JSX, useEffect, useState} from "react";
import styles from "./StationsTablePage.module.scss";
import Pagination from "frontend/components/table/Pagination.tsx";
import AppRoutes from "frontend/AppRoutes.tsx";
import {useNavigate} from "react-router-dom";
import SelectField from "frontend/components/input/SelectField.tsx";
import InputField from "frontend/components/input/InputField.tsx";
import type {PaginationResult} from "common/Results.ts";
import type Station from "common/entities/Station.ts";
import {Status} from "common/entities/Station.ts";

export default function StationsTablePage() {
    const [stations, setStations] = useState<PaginationResult<Station[]>>();
    const [tableData, setTableData] = useState<(string)[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<Partial<Station>>();
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            stationService.getStations({page: currentPage, limit: 20, ...search})
                .then(res => {
                    setStations(res);
                    const mapped = res.data.map(station => [
                        station.station_id,
                        station.city_name,
                        station.station_name,
                        station.platform_name,
                    ]);
                    setTableData(mapped);
                })
                .catch((err: unknown) => {
                    console.error(err)
                });
        }, 500);
        return () => {
            clearTimeout(handler)
        };
    }, [currentPage, search]);


    const header = [
        "Station ID",
        "City",
        "Station Name",
        "Platform",
    ];

    const handleRowClick = (_row: (string | JSX.Element)[], index: number, _id: string | null): void => {
        const route = AppRoutes.Station.replace(":id", stations?.data[index].station_id ?? '');

        navigate(route)?.then(() => {
        })
            .catch((err: unknown) => {
                console.log(err)
            });
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setSearch((prev) => ({
            ...prev,
            [name]: value || undefined,
        }));
        setCurrentPage(1);
    };

    const handleShowButton = () => {
        setShowFilters((prev) => !prev);
    }

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    }
    return (
        <div className={styles.table}>
            <button
                type="button"
                onClick={handleShowButton}
                className={styles.toggleButton}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            {showFilters &&
                <div className={styles.search}>

                    <InputField
                        name="station_id"
                        value={search?.station_id}
                        onChange={handleChange}
                        placeholder="Station ID"
                    />
                    <InputField
                        name="city_name"
                        value={search?.city_name}
                        onChange={handleChange}
                        placeholder="City"
                    />
                    <InputField
                        name="station_name"
                        value={search?.station_name}
                        onChange={handleChange}
                        placeholder="Station Name"
                    />
                    <InputField
                        name="local_name"
                        value={search?.local_name}
                        onChange={handleChange}
                        placeholder="Local Name"
                    />
                    <InputField
                        name="timezone"
                        value={search?.timezone}
                        onChange={handleChange}
                        placeholder="Timezone"
                    />
                    <InputField
                        name="platform_name"
                        value={search?.platform_name}
                        onChange={handleChange}
                        placeholder="Platform"
                    />
                    <SelectField
                        name="status"
                        value={search?.status}
                        onChange={handleChange}
                    >
                        <option value="">Status</option>
                        {Object.values(Status).map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </SelectField>
                </div>
            }

            <DataTable data={tableData} header={header} handleRowClick={handleRowClick}/>
            <Pagination
                currentPage={stations?.pagination.page || 0}
                totalPages={stations?.pagination.pages || 0}
                onPageChange={onPageChange}
            />
        </div>
    );
}