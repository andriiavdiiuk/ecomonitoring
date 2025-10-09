import React, {type JSX, useEffect, useState} from "react";
import stationService, {type Station} from "frontend/services/StationService.ts";
import styles from './EditStationPage.module.scss'
import InputField from "frontend/components/input/InputField.tsx";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";

export default function EditStationPage(): JSX.Element {
    const [form, setForm] = useState<Station>({
        station_id: undefined,
        city_name: undefined,
        station_name: undefined,
        local_name: undefined,
        timezone: undefined,
        geolocation: {type: "Point", coordinates: [0, 0]},
        platform_name: undefined,
        status: "active",
        measured_parameters: [],
    });

    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            stationService.getStation(id)
                .then((res) => {
                    setForm(res);
                }).catch((err: unknown) => {
                console.log(err);
            })
        }
    }, [id]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        if (name === "latitude") {
            setForm(prev => ({
                ...prev,
                geolocation: {
                    type: "Point",
                    coordinates: [prev.geolocation?.coordinates[0], parseFloat(value)] as [number, number]
                }
            }));
        } else if (name === "longitude") {
            setForm(prev => ({
                ...prev,
                geolocation: {
                    type: "Point",
                    coordinates: [parseFloat(value), prev.geolocation?.coordinates[1]] as [number, number]
                }
            }));
        } else if (name === "measured_parameters") {
            const params = Array.from(
                (e.target as HTMLSelectElement).selectedOptions,
                option => option.value
            );
            setForm(prev => ({...prev, measured_parameters: params}));
        } else {
            setForm(prev => ({...prev, [name]: value}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);


        let res: Promise<Station>;

        if (id) {
            res = stationService.updateStation(form);
        } else {
            res = stationService.createStation(form);
        }

        res
            .then((saved) => {
                setSuccess(true);
                void navigate(AppRoutes.Station.replace(":id", saved.station_id || ""));
            })
            .catch((err: unknown) => {
                console.log(err);
            })
    };

    return (
        <div className={styles.container}>
            {!id && <h2>Create New Station</h2>}
            {id && <h2>Edit Station</h2>}
            {error && <p style={{color: "red"}}>{error}</p>}
            {success && <p style={{color: "green"}}>Station created successfully!</p>}
            <form onSubmit={handleSubmit}>
                <InputField label="Station Id"
                            name="station_id"
                            value={form.station_id}
                            onChange={handleChange}/>
                <InputField label="City"
                            name="city_name"
                            value={form.city_name}
                            onChange={handleChange}/>
                <InputField label="Station Name"
                            name="station_name"
                            value={form.station_name}
                            onChange={handleChange}/>
                <InputField label="Local Name"
                            name="local_name"
                            value={form.local_name}
                            onChange={handleChange}/>
                <InputField label="Timezone"
                            name="timezone"
                            value={form.timezone}
                            onChange={handleChange}/>
                <InputField label="Longitude"
                            name="longitude"
                            type="number"
                            min="0"
                            max="360"
                            step="any"
                            value={form.geolocation?.coordinates[0]}
                            onChange={handleChange}/>
                <InputField label="Latitude"
                            name="latitude"
                            type="number"
                            value={form.geolocation?.coordinates[1]}
                            min="0"
                            max="360"
                            step="any"
                            onChange={handleChange}/>
                <InputField label="Platform"
                            name="platform_name"
                            value={form.platform_name}
                            onChange={handleChange}/>
                <InputField label="Status"
                            name="status"
                            value={form.status}
                            onChange={handleChange}/>

                <fieldset>
                    <legend>Measured Parameters</legend>
                    {[
                        "PM2.5",
                        "PM10",
                        "Temperature",
                        "Humidity",
                        "Pressure",
                        "Air Quality Index",
                        "NO2",
                        "SO2",
                        "CO",
                        "O3",
                    ].map(param => (
                        <label key={param} style={{display: "block"}}>
                            <input
                                type="checkbox"
                                name="measured_parameters"
                                value={param}
                                checked={form.measured_parameters?.includes(param)}
                                onChange={e => {
                                    const checked = e.target.checked;
                                    setForm(prev => ({
                                        ...prev,
                                        measured_parameters: checked
                                            ? [...prev.measured_parameters ?? [], param]
                                            : prev.measured_parameters?.filter(p => p !== param)
                                    }));
                                }}
                            />
                            {param}
                        </label>
                    ))}
                </fieldset>
                <InputField type="submit" value="Submit"/>
            </form>
        </div>
    );
}
