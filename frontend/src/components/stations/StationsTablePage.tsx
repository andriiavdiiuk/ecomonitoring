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

interface Search {
    by: string;
    value: string;
}

export default function StationsTablePage() {
    const [stations, setStations] = useState<PaginationResult<Station[]>>();
    const [tableData, setTableData] = useState<(string)[][]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [search, setSearch] = useState<Search>({by: '', value: ''});
    const navigate = useNavigate();

    useEffect(() => {
        const handler = setTimeout(() => {
            const params: Record<string, string> = {};
            if (search.by && search.value) {
                if (search.by === 'city') params.city = search.value;
                else if (search.by === 'status') params.status = search.value;
            }
            stationService.getStations({page: currentPage, limit: 20, ...params})
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
        },500);
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
        setSearch(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1);
    };

    const onPageChange = (page: number): void => {
        setCurrentPage(page);
    }
    return (
        <div className={styles.table}>
            <div className={styles.search}>
                <SelectField name='by' value={search.by} onChange={handleChange}>
                    <option>Search by</option>
                    <option value="city">City</option>
                    <option value="status">Status</option>
                </SelectField>
                <InputField
                    name='value'
                    value={search.value}
                    onChange={handleChange}
                    className={styles.input}
                />
            </div>
            <DataTable data={tableData} header={header} handleRowClick={handleRowClick}/>
            <Pagination
                currentPage={stations?.pagination.page || 0}
                totalPages={stations?.pagination.pages || 0}
                onPageChange={onPageChange}
            />
        </div>
    );
}