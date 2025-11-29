import styles from "frontend/components/health_risk/HealthRIskCalculatorPage.module.scss";
import {type JSX, useState} from "react";
import {calculateRisk} from "common/health_risk/HealthRiskCalculator.ts";
import {MeasuredParameters, type Pollutant, Unit} from "common/entities/Pollutant.ts";
import type {HealthRisk} from "common/entities/HealthRisk.ts";
import SelectField from "frontend/components/input/SelectField.tsx";
import InputField from "frontend/components/input/InputField.tsx";
import HealthRiskLevels from "frontend/components/health_risk/HealthRiskLevels.tsx";

export default function HealthRiskCalculatorPage(): JSX.Element {
    const [measuredParameter, setMeasuredParameter] = useState<MeasuredParameters>(MeasuredParameters.NO2);
    const [C, setC] = useState<number>(0);
    const [IR, setIR] = useState<number>(15);
    const [EF, setEF] = useState<number>(365);
    const [ED, setED] = useState<number>(1);
    const [BW, setBW] = useState<number>(70);
    const [AT, setAT] = useState<number>(25550);
    const [RFC, setRfC] = useState<number>(0.001);
    const [SF, setSF] = useState<number>(0.5);

    const [result, setResult] = useState<HealthRisk | null>({
        medium: "",
        C: C,
        IR: IR,
        EF: EF,
        ED: ED,
        BW: BW,
        AT: AT,
        RfC: RFC,
        SF: SF,
        CDI: 0, CR: 0, HI: 0, HQ: 0,
        createdAt: new Date(),
    });

    const handleCalculate = () => {
        const pollutant: Pollutant = {
            pollutant: measuredParameter,
            value: C,
            unit: Unit.MgPerM3,
        };
        const risk = calculateRisk(pollutant, [], {IR, EF, ED, BW, AT, RFC, SF});
        setResult(
            risk ?? {
                medium: measuredParameter,
                C,
                IR,
                EF,
                ED,
                BW,
                AT,
                RfC: RFC,
                SF,
                CDI: 0,
                HQ: 0,
                HI: 0,
                CR: 0,
                createdAt: new Date()
            }
        );
    };

    const allowedPollutants = [
        MeasuredParameters.NO2,
        MeasuredParameters.SO2,
        MeasuredParameters.CO,
        MeasuredParameters.O3,
    ];

    return (
        <div className={styles.container}>
            <h2>Health Risk Calculator</h2>

            <div className={styles.grid}>
                <SelectField label={"Pollutant"} value={measuredParameter} onChange={(e) => {
                    setMeasuredParameter(e.target.value as MeasuredParameters)
                }}>
                    {allowedPollutants.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </SelectField>

                <InputField
                    label="Concentration (C)"
                    type="number"
                    value={C}
                    onChange={(e) => {
                        setC(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Inhalation rate (IR)"
                    type="number"
                    value={IR}
                    onChange={(e) => {
                        setIR(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Exposure frequency (EF)"
                    type="number"
                    value={EF}
                    onChange={(e) => {
                        setEF(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Exposure duration (ED)"
                    type="number"
                    value={ED}
                    onChange={(e) => {
                        setED(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Body weight (BW)"
                    type="number"
                    value={BW}
                    onChange={(e) => {
                        setBW(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Averaging time (AT)"
                    type="number"
                    value={AT}
                    onChange={(e) => {
                        setAT(Number(e.target.value));
                    }}
                />

                <InputField
                    label="RfC"
                    type="number"
                    step={0.000001}
                    value={RFC}
                    onChange={(e) => {
                        setRfC(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Slope factor (SF)"
                    type="number"
                    step={0.0001}
                    value={SF}
                    onChange={(e) => {
                        setSF(Number(e.target.value));
                    }}
                />
            </div>

            <button className={styles.calcButton} onClick={handleCalculate}>
                Calculate
            </button>

            {(
                <div className={styles.resultBox}>
                    <HealthRiskLevels risk={result}/>
                </div>
            )}

        </div>
    );

}