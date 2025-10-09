import React, {type JSX, useEffect, useState} from "react";
import styles from './EditMeasurementPage.module.scss'
import InputField from "frontend/components/input/InputField.tsx";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";
import measurementService, {type Measurement, type MeasurementUpdate} from "frontend/services/MeasurementService.ts";
import SelectField from "frontend/components/input/SelectField.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";

export default function EditMeasurementPage(): JSX.Element {
    const {station_id, measurement_id} = useParams<{ station_id: string,measurement_id:string }>();
    const navigate = useNavigate();
    const userContext = useUser();
    const now = new Date();
    now.setMinutes(now.getMinutes()-now.getTimezoneOffset());
    const [form, setForm] = useState<Partial<Measurement>>({
        station_id: station_id,
        status: "active",
        measurement_time: now.toISOString().slice(0, 16),
        pollutants: [
            {
                pollutant: "PM2.5",
                value: 0,
                unit: "ug/m3",
                averaging_period: "1 hour",
                quality_flag: "valid",
            },
        ],
    });




    useEffect(() => {
        if (measurement_id) {
            measurementService.getMeasurement(measurement_id)
                .then((res) => {
                    const time = new Date(res.measurement_time);
                    time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
                    res.measurement_time = time.toISOString().slice(0,16)
                    setForm(res);
                }).catch((err: unknown) => {
                console.log(err);
            })
        }
    }, [measurement_id]);

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);


        let res: Promise<MeasurementUpdate>;

        if (measurement_id) {
            res = measurementService.updateMeasurement(form);
        } else {
            res = measurementService.createMeasurement(form);
        }

        res
            .then((res) => {
                setSuccess(true);
                void navigate(AppRoutes.Station.replace(":id", res.measurement.station_id || ""));
            })
            .catch((err: unknown) => {
                console.log(err);
            })
    };
    const handlePollutantChange = (index: number, field: string, value: string | number) => {
        setForm(prev => {
            const pollutants = [...(prev.pollutants ?? [])];

            pollutants[index] = {
                ...pollutants[index],
                [field]: field === "value" ? Number(value) : value
            };

            return { ...prev, pollutants };
        });
    };

    const handleRemove = (index: number) => {
        setForm(prev => ({
                ...prev,
                pollutants: (prev.pollutants ?? []).filter((_, idx) => idx !== index)
            }
        ));
    }

    const handleDelete = () => {
        measurementService.deleteMeasurement(measurement_id || '')
            .then(() => {
                void navigate(AppRoutes.Home);
            })
            .catch((err: unknown) => {
                console.log(err);
            })
    }


    const addPollutant = () => {
        setForm(prev => ({
            ...prev,
            pollutants: [
                ...(prev.pollutants ?? []),
                {
                    pollutant: "",
                    value: 0,
                    unit: "",
                    averaging_period: "",
                    quality_flag: "",
                },
            ],
        }));
    };

    return  (
        <div className={styles.container}>

            {userContext.user?.isRole("admin") &&
                <div className={styles.controls}>
                    <button className={styles.button_danger} onClick={handleDelete}>Delete Measurement</button>
                </div>
            }

            {!measurement_id && <h2>Create Station Measurement</h2> }
            {measurement_id && <h2>Edit Station Measurement</h2> }
            {error && <p style={{color: "red"}}>{error}</p>}
            {success && <p style={{color: "green"}}>Station created successfully!</p>}
            <form onSubmit={handleSubmit}>

                <InputField
                    label="Status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                />

                <InputField
                    label="Measurement Time"
                    name="measurement_time"
                    type="datetime-local"
                    value={form.measurement_time}
                    onChange={handleChange}
                />

                <fieldset>
                    <legend>Pollutants</legend>
                    {(form.pollutants ?? []).map((pollutant, i) => (
                        <div
                            key={i}
                            style={{
                                marginBottom: "1.5em",
                                borderBottom: "1px solid #ccc",
                                paddingBottom: "1em",
                                position: "relative"
                            }}
                        >
                            <h4 style={{ marginBottom: "0.5em" }}>Pollutant {i + 1}</h4>

                            <label>
                                <SelectField
                                    label="Pollutant"
                                    name="pollutant"
                                    value={pollutant.pollutant}
                                    onChange={e => { handlePollutantChange(i, "pollutant", e.target.value); }}
                                >
                                    <option value="">Select pollutant</option>
                                    <option value="PM2.5">PM2.5</option>
                                    <option value="PM10">PM10</option>
                                    <option value="Temperature">Temperature</option>
                                    <option value="Humidity">Humidity</option>
                                    <option value="Pressure">Pressure</option>
                                    <option value="Air Quality Index">Air Quality Index</option>
                                    <option value="NO2">NO2</option>
                                    <option value="SO2">SO2</option>
                                    <option value="CO">CO</option>
                                    <option value="O3">O3</option>
                                </SelectField>
                            </label>

                            <InputField
                                label="Value"
                                name="value"
                                type="number"
                                step="any"
                                value={pollutant.value}
                                onChange={e => { handlePollutantChange(i, "value", e.target.value); }}
                            />

                            <label>
                                <SelectField
                                    label="Unit"
                                    name="unit"
                                    value={pollutant.unit}
                                    onChange={e => { handlePollutantChange(i, "unit", e.target.value); }}
                                >
                                    <option value="">Select unit</option>
                                    <option value="ug/m3">ug/m3</option>
                                    <option value="Celcius">Celcius</option>
                                    <option value="%">%</option>
                                    <option value="hPa">hPa</option>
                                    <option value="aqi">aqi</option>
                                    <option value="mg/m3">mg/m3</option>
                                    <option value="ppm">ppm</option>
                                </SelectField>
                            </label>


                            <label>
                                <SelectField
                                    label="Averaging Period"
                                    name="averaging_period"
                                    value={pollutant.averaging_period}
                                    onChange={e => { handlePollutantChange(i, "averaging_period", e.target.value); }}
                                >
                                    <option value="">Select period</option>
                                    <option value="1 minute">1 minute</option>
                                    <option value="2 minutes">2 minutes</option>
                                    <option value="5 minutes">5 minutes</option>
                                    <option value="15 minutes">15 minutes</option>
                                    <option value="1 hour">1 hour</option>
                                    <option value="24 hours">24 hours</option>
                                </SelectField>
                            </label>

                            <label>
                                <SelectField
                                    label="Quality Flag"
                                    name="quality_flag"
                                    value={pollutant.quality_flag}
                                    onChange={e => { handlePollutantChange(i, "quality_flag", e.target.value); }}
                                >
                                    <option value="">Select flag</option>
                                    <option value="valid">valid</option>
                                    <option value="invalid">invalid</option>
                                    <option value="estimated">estimated</option>
                                    <option value="preliminary">preliminary</option>
                                </SelectField>
                            </label>

                            <button
                                className={styles.button_danger}
                                type="button"
                                onClick={() => { handleRemove(i); }}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button  type="button" onClick={addPollutant}>
                        + Add Pollutant
                    </button>
                </fieldset>



                <InputField type="submit" value="Submit" />
            </form>
        </div>
    );
}
