import React, {type JSX, useEffect, useState} from "react";
import styles from './EditMeasurementPage.module.scss'
import InputField from "frontend/components/input/InputField.tsx";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";
import measurementService, {type Measurement, type MeasurementUpdate} from "frontend/services/MeasurementService.ts";
import SelectField from "frontend/components/input/SelectField.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
import {
    type FormErrors,
    mapValidationErrors,
    type ValidationErrorResponse
} from "frontend/services/ValidationService.ts";
import axios from "axios";
export default function EditMeasurementPage(): JSX.Element {
    const {station_id, measurement_id} = useParams<{ station_id: string,measurement_id:string }>();
    const [errors, setErrors] = useState<FormErrors<Measurement>>();
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let res: Promise<MeasurementUpdate>;

        if (measurement_id) {
            res = measurementService.updateMeasurement(form);
        } else {
            res = measurementService.createMeasurement(form);
        }

        res
            .then((res) => {
                setErrors(undefined)
                void navigate(AppRoutes.Station.replace(":id", res.measurement.station_id || ""));
            })
            .catch((err: unknown) => {
                if (axios.isAxiosError(err) && err.response?.data) {
                    const data = err.response.data as ValidationErrorResponse;
                    const errors = mapValidationErrors<Measurement>(data.errors);
                    console.log(errors);
                    setErrors(errors);
                }
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
            <form onSubmit={handleSubmit}>

                <InputField
                    label="Status"
                    name="status"
                    error={errors?.status}
                    value={form.status}
                    onChange={handleChange}
                />

                <InputField
                    label="Measurement Time"
                    name="measurement_time"
                    type="datetime-local"
                    error={errors?.measurement_time}
                    value={form.measurement_time}
                    onChange={handleChange}
                />

                <fieldset>
                    <legend>Pollutants</legend>
                    {(form.pollutants ?? []).map((pollutant, i) => (
                        <div
                            key={i}
                            className={styles.pollutant}
                        >
                            <h4>Pollutant {i + 1}</h4>

                            <div>
                                <SelectField
                                    label="Pollutant"
                                    name="pollutant"
                                    error={errors?.pollutants[i].pollutant}
                                    value={pollutant.pollutant}
                                    onChange={e => { handlePollutantChange(i, "pollutant", e.target.value); }}
                                >
                                    <option value="">Select pollutant</option>
                                    <option value="PM2.51">PM2.51</option>
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
                            </div>

                            <InputField
                                label="Value"
                                name="value"
                                type="number"
                                step="any"
                                error={errors?.pollutants[i].value}
                                value={pollutant.value}
                                onChange={e => { handlePollutantChange(i, "value", e.target.value); }}
                            />

                            <div>
                                <SelectField
                                    label="Unit"
                                    name="unit"
                                    error={errors?.pollutants[i].unit}
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
                            </div>


                            <div>
                                <SelectField
                                    label="Averaging Period"
                                    name="averaging_period"
                                    error={errors?.pollutants[i].averaging_period}
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
                            </div>

                            <div>
                                <SelectField
                                    label="Quality Flag"
                                    name="quality_flag"
                                    error={errors?.pollutants[i].quality_flag}
                                    value={pollutant.quality_flag}
                                    onChange={e => { handlePollutantChange(i, "quality_flag", e.target.value); }}
                                >
                                    <option value="">Select flag</option>
                                    <option value="valid">valid</option>
                                    <option value="invalid">invalid</option>
                                    <option value="estimated">estimated</option>
                                    <option value="preliminary1">preliminary1</option>
                                </SelectField>
                            </div>

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
