import {MeasuredParameters, Pollutant, Unit} from "common/entities/Pollutant";
import {HealthRisk} from "common/entities/HealthRisk";
import {HealthRiskOptionsDto} from "common/validation/schemas/HealthRiskSchemas";

const relevantPollutants = [
    MeasuredParameters.PM25,
    MeasuredParameters.PM10,
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

function resolveAT(options?: HealthRiskOptionsDto, EF = 365, ED = 1) {
    const defaultAT = EF * ED;

    if (options?.AT && options.AT > 0) {
        return { AT: options.AT };
    }
    return { AT: defaultAT };
}

function resolveExposureValues(options?: HealthRiskOptionsDto) {
    return {
        IR: options?.IR ?? 15,
        EF: options?.EF ?? 365,
        ED: options?.ED ?? 1,
        BW: options?.BW ?? 70
    };
}

function calculateRisk(
    pollutant?: Partial<Pollutant>,
    allMeasurementPollutants?: Pollutant[],
    options?: HealthRiskOptionsDto
): HealthRisk | null {
    const param = pollutant?.pollutant;
    const { IR, EF, ED, BW } = resolveExposureValues(options);
    const { AT } = resolveAT(options, EF, ED);

    let RFC = options?.RFC;
    let SF = options?.SF ?? 0;
    let C: number | undefined;

    if (!param) {

        C = options?.C;
        RFC = options?.RFC;
        SF = options?.SF ?? 0;

        if (C == null || RFC == null) {
            return null;
        }

    } else {

        if (!relevantPollutants.includes(param)) return null;

        RFC = options?.RFC ?? RFC_VALUES[param] ?? 0;
        SF = options?.SF ?? SF_VALUES[param] ?? 0;
        if (!RFC) return null;

        const molecularWeight = MOLECULAR_WEIGHTS[param];
        const temperature = allMeasurementPollutants
            ? getContextValue(allMeasurementPollutants, MeasuredParameters.Temperature)
            : undefined;

        C = options?.C ?? convertToMgPerM3(
            pollutant?.value ?? 0,
            pollutant?.unit ?? Unit.MgPerM3,
            molecularWeight,
            temperature
        ) ?? undefined;
        if (!C) return null;
    }

    const CDI = (C * IR * EF * ED) / (BW * AT);

    const HQ = C / RFC;
    const HI = HQ;
    const CR = CDI * SF;

    return {
        medium: "air",
        C,
        ED,
        BW,
        AT: AT,
        IR,
        EF,
        CR,
        SF,
        HI,
        HQ,
        CDI,
        RfC: RFC,
        createdAt: new Date()
    };
}


function convertToMgPerM3(value: number, unit: Unit, molecularWeight?: number, temperature?: number): number | null {
    switch (unit) {
        case Unit.UgPerM3:
            return value / 1000;
        case Unit.MgPerM3:
            return value;
        case Unit.Ppm:
            if (!molecularWeight || !temperature) return null;
            return (value * molecularWeight) / temperature;
        default:
            return null;
    }
}

const MOLECULAR_WEIGHTS: Record<string, number> = {
    [MeasuredParameters.NO]: 30,
    [MeasuredParameters.NO2]: 46,
    [MeasuredParameters.SO2]: 64,
    [MeasuredParameters.CO]: 28,
    [MeasuredParameters.CO2]: 44,
    [MeasuredParameters.O3]: 48,
    [MeasuredParameters.NH3]: 17,
    [MeasuredParameters.BenzoAPyrene]: 252,
    [MeasuredParameters.Cd]: 112.41,
    [MeasuredParameters.CuO]: 79.55,
    [MeasuredParameters.As]: 74.92,
    [MeasuredParameters.NiO]: 74.69,
    [MeasuredParameters.Hg]: 200.59,
    [MeasuredParameters.SeO2]: 110.96,
    [MeasuredParameters.Pb]: 207.2,
    [MeasuredParameters.CrVI]: 99.99,
    [MeasuredParameters.ZnO]: 81.38,
}

function getContextValue(pollutants: Pollutant[], param: MeasuredParameters): number | undefined {
    const p = pollutants.find(p => p.pollutant === param);
    return p?.value;
}
const RFC_VALUES: Record<string, number> = {
    [MeasuredParameters.PM10]: 0.15,
    [MeasuredParameters.PM25]: 0.015,
    [MeasuredParameters.NO]: 0.04,
    [MeasuredParameters.NO2]: 0.04,
    [MeasuredParameters.NH3]: 0.04,
    [MeasuredParameters.SO2]: 0.005,
    [MeasuredParameters.CO]: 3,
    [MeasuredParameters.CO2]: 0,
    [MeasuredParameters.O3]: 0.14,
    [MeasuredParameters.BenzoAPyrene]: 0.000001,
    [MeasuredParameters.Cd]: 0.0003,
    [MeasuredParameters.CuO]: 0.002,
    [MeasuredParameters.As]: 0.0003,
    [MeasuredParameters.NiO]: 0.001,
    [MeasuredParameters.Hg]: 0.0003,
    [MeasuredParameters.SeO2]: 0.00005,
    [MeasuredParameters.Pb]: 0.0003,
    [MeasuredParameters.CrVI]: 0.0015,
    [MeasuredParameters.ZnO]: 0.05
};

const SF_VALUES: Record<string, number> = {
    [MeasuredParameters.BenzoAPyrene]: 3.1,
    [MeasuredParameters.As]: 15,
    [MeasuredParameters.NiO]: 0.91,
    [MeasuredParameters.Cd]: 6.3,
    [MeasuredParameters.Pb]: 0.042,
    [MeasuredParameters.CrVI]: 42
};
export  {RFC_VALUES, SF_VALUES, calculateRisk, convertToMgPerM3, getContextValue, MOLECULAR_WEIGHTS }