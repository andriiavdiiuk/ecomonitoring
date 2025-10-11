import React, {type JSX, useEffect, useState} from "react";
import styles from './EditMeasurementPage.module.scss'
import InputField from "frontend/components/input/InputField.tsx";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";
import measurementService  from "frontend/services/MeasurementService.ts";
import SelectField from "frontend/components/input/SelectField.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
import axios from "axios";
import type {Measurement} from "common/entities/Measurement.ts";
import {Status} from "common/entities/Station.ts";
import {AveragingPeriod, MeasuredParameters, QualityFlag, Unit} from "common/entities/Pollutant.ts";
import type {MeasurementThreshold, ProblemDetail, ProblemDetailErrors} from "common/Results.ts";

export default function EditMeasurementPage(): JSX.Element {
    const {station_id, measurement_id} = useParams<{ station_id: string, measurement_id: string }>();
    const [errors, setErrors] = useState<ProblemDetailErrors<Measurement>>();
    const navigate = useNavigate();
    const userContext = useUser();
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const [form, setForm] = useState<Partial<Measurement>>({
        station_id: station_id,
        status: Status.Active,
        measurement_time: now,
        pollutants: [
            {
                pollutant: MeasuredParameters.PM25,
                value: 0,
                unit: Unit.UgPerM3,
                averaging_period: AveragingPeriod.OneMinute,
                quality_flag: QualityFlag.Valid,
            },
        ],
    });


    useEffect(() => {
        if (measurement_id) {
            measurementService.getMeasurement(measurement_id)
                .then((res) => {
                    const time = new Date(res.measurement_time);
                    time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
                    res.measurement_time = time;
                    setForm(res);
                }).catch((err: unknown) => {
                console.log(err);
            })
        }
    }, [measurement_id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let res: Promise<MeasurementThreshold>;

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
                    const data = err.response.data as ProblemDetail<Measurement>;
                    setErrors(data.errors);
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

            return {...prev, pollutants};
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
                    pollutant: MeasuredParameters.PM25,
                    value: 0,
                    unit: Unit.UgPerM3,
                    averaging_period: AveragingPeriod.OneMinute,
                    quality_flag: QualityFlag.Valid,
                },
            ],
        }));
    };

    return (
        <div className={styles.container}>

            {userContext.user?.isRole("admin") &&
                <div className={styles.controls}>
                    <button className={styles.button_danger} onClick={handleDelete}>Delete Measurement</button>
                </div>
            }

            {!measurement_id && <h2>Create Station Measurement</h2>}
            {measurement_id && <h2>Edit Station Measurement</h2>}
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
                    error={errors?.measurement_time as unknown as string[]}
                    value={form.measurement_time?.toISOString().slice(0, 16)}
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
                                    error={errors?.pollutants?.[i]?.pollutant}
                                    value={pollutant.pollutant}
                                    onChange={e => {
                                        handlePollutantChange(i, "pollutant", e.target.value);
                                    }}
                                >
                                    <option value="">Select pollutant</option>
                                    {Object.values(MeasuredParameters).map((param) => (
                                        <option key={param} value={param}>
                                            {param}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>

                            <InputField
                                label="Value"
                                name="value"
                                type="number"
                                step="any"
                                error={errors?.pollutants?.[i]?.value}
                                value={pollutant.value}
                                onChange={e => {
                                    handlePollutantChange(i, "value", e.target.value);
                                }}
                            />
                            <div>
                                <SelectField
                                    label="Unit"
                                    name="unit"
                                    error={errors?.pollutants?.[i]?.unit}
                                    value={pollutant.unit}
                                    onChange={e => {
                                        handlePollutantChange(i, "unit", e.target.value);
                                    }}
                                >
                                    <option value="">Select unit</option>
                                    {Object.values(Unit).map((param) => (
                                        <option key={param} value={param}>
                                            {param}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>


                            <div>
                                <SelectField
                                    label="Averaging Period"
                                    name="averaging_period"
                                    error={errors?.pollutants?.[i]?.averaging_period}
                                    value={pollutant.averaging_period}
                                    onChange={e => {
                                        handlePollutantChange(i, "averaging_period", e.target.value);
                                    }}
                                >
                                    <option value="">Select period</option>
                                    {Object.values(AveragingPeriod).map((param) => (
                                        <option key={param} value={param}>
                                            {param}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>

                            <div>
                                <SelectField
                                    label="Quality Flag"
                                    name="quality_flag"
                                    error={errors?.pollutants?.[i]?.quality_flag}
                                    value={pollutant.quality_flag}
                                    onChange={e => {
                                        handlePollutantChange(i, "quality_flag", e.target.value);
                                    }}
                                >
                                    <option value="">Select flag</option>
                                    {Object.values(QualityFlag).map((param) => (
                                        <option key={param} value={param}>
                                            {param}
                                        </option>
                                    ))}
                                </SelectField>
                            </div>

                            <button
                                className={styles.button_danger}
                                type="button"
                                onClick={() => {
                                    handleRemove(i);
                                }}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addPollutant}>
                        + Add Pollutant
                    </button>
                </fieldset>


                <InputField type="submit" value="Submit"/>
            </form>
        </div>
    );
}
