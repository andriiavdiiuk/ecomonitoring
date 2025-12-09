import styles from "frontend/components/health_risk/HealthRIskCalculatorPage.module.scss";
import {type JSX, useState} from "react";
import {calculateRisk} from "common/health_risk/HealthRiskCalculator.ts";
import {MeasuredParameters, type Pollutant, Unit} from "common/entities/Pollutant.ts";
import type {HealthRisk} from "common/entities/HealthRisk.ts";
import SelectField from "frontend/components/input/SelectField.tsx";
import InputField from "frontend/components/input/InputField.tsx";
import HealthRiskLevel from "frontend/components/health_risk/HealthRiskLevel.tsx";
import {getCDIlevel, getCRlevel, getHQlevel} from "frontend/components/health_risk/HealthRiskLevels.ts";

export default function HealthRiskCalculatorPage(): JSX.Element {
    const [measuredParameter, setMeasuredParameter] = useState<MeasuredParameters | undefined>(undefined);
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
        const pollutant: Partial<Pollutant> = {
            pollutant: measuredParameter,
            value: C,
            unit: Unit.MgPerM3,
        };
        const options = measuredParameter
            ? {C, IR, EF, ED, BW, AT}
            : {C, IR, EF, ED, BW, AT, RFC, SF};
        const risk = calculateRisk(pollutant, [], options);
        setResult(
            risk ?? {
                medium: measuredParameter ?? "",
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
        MeasuredParameters.O3,
        MeasuredParameters.NO,
        MeasuredParameters.CO,
        MeasuredParameters.CO2,
        MeasuredParameters.NH3,
        MeasuredParameters.BenzoAPyrene,
        MeasuredParameters.Cd,
        MeasuredParameters.CuO,
        MeasuredParameters.As,
        MeasuredParameters.NiO,
        MeasuredParameters.Hg,
        MeasuredParameters.SeO2,
        MeasuredParameters.Pb,
        MeasuredParameters.CrVI,
        MeasuredParameters.ZnO,
    ];

    return (
        <div className={styles.container}>
            <h2>Health Risk Calculator</h2>

            <div className={styles.grid}>
                <SelectField label={"Pollutant"} value={measuredParameter}
                             onChange={(e) => {
                                 const value = e.target.value;
                                 if (value == "none") {
                                     setMeasuredParameter(undefined);
                                 } else {
                                     setMeasuredParameter(e.target.value as MeasuredParameters)
                                 }
                             }}>
                    <option value="none">None</option>
                    {allowedPollutants.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </SelectField>

                <InputField
                    label="Concentration (C) mg/cm^3"
                    type="number"
                    value={C}
                    onChange={(e) => {
                        setC(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Inhalation rate (IR) volume/day"
                    type="number"
                    value={IR}
                    onChange={(e) => {
                        setIR(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Exposure frequency (EF) days/year"
                    type="number"
                    value={EF}
                    onChange={(e) => {
                        setEF(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Exposure duration (ED) years"
                    type="number"
                    value={ED}
                    onChange={(e) => {
                        setED(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Body weight (BW) kg"
                    type="number"
                    value={BW}
                    onChange={(e) => {
                        setBW(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Averaging time (AT) days"
                    type="number"
                    value={AT}
                    onChange={(e) => {
                        setAT(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Reference concentration (RfC) mg/m^3"
                    type="number"
                    step={0.000001}
                    value={RFC}
                    disabled={measuredParameter !== undefined}
                    onChange={(e) => {
                        setRfC(Number(e.target.value));
                    }}
                />

                <InputField
                    label="Slope factor (SF) mg/(kg*day)"
                    type="number"
                    step={0.0001}
                    value={SF}
                    disabled={measuredParameter !== undefined}
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
                    <HealthRiskLevel label={"Chronic Daily Intake (CDI)"} value={result?.CDI} getLevel={getCDIlevel}/>
                    <HealthRiskLevel label={"Carcinogenic Risk (CR)"} value={result?.CR} getLevel={getCRlevel}/>
                    <HealthRiskLevel label={"Hazard Quotient (HQ)"} value={result?.HQ} getLevel={getHQlevel}/>
                </div>
            )}

        </div>
    );

}