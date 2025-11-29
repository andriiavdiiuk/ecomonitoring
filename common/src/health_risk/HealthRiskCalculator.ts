import {MeasuredParameters, Pollutant, Unit} from "common/entities/Pollutant";
import {HealthRisk} from "common/entities/HealthRisk";
import {HealthRiskOptionsDto} from "common/validation/schemas/HealthRiskSchemas";

const relevantPollutants = [
    MeasuredParameters.PM25,
    MeasuredParameters.PM10,
    MeasuredParameters.NO2,
    MeasuredParameters.SO2,
    MeasuredParameters.CO,
    MeasuredParameters.O3
];

function calculateRisk(
    pollutant: Pollutant,
    allMeasurementPollutants?: Pollutant[],
    options?: HealthRiskOptionsDto
): HealthRisk | null {

    if (!relevantPollutants.includes(pollutant.pollutant)) return null;

    const IR = options?.IR ?? 15;
    const EF = options?.EF ?? 365;
    const ED = options?.ED ?? 1;
    const BW = options?.BW ?? 70;
    let AT_HQ = EF * ED;
    let AT_CR = 70 * 365;
    if (options?.AT) {
        AT_HQ = options.AT;
        AT_CR = options.AT;
    }

    const RFC = options?.RFC ?? getRFC(pollutant.pollutant);
    const SF = options?.SF ?? 0;
    if (!RFC) return null;


    const molecularWeight = getMolecularWeight(pollutant.pollutant);
    const temperature = allMeasurementPollutants
        ? getContextValue(allMeasurementPollutants, MeasuredParameters.Temperature)
        : undefined;

    const C = options?.C ?? convertToMgPerM3(pollutant.value, pollutant.unit, molecularWeight, temperature);
    if (!C) return null;

    const CDI_HQ = (C * IR * EF * ED) / (BW * AT_HQ);
    const CDI_CR = (C * IR * EF * ED) / (BW * AT_CR);
    const HQ = C / RFC;
    const HI = HQ;
    const CR = CDI_CR * SF;

    return {
        medium: "air",
        C,
        ED,
        BW,
        AT: AT_HQ,
        IR,
        EF,
        CR,
        SF,
        HI,
        HQ,
        CDI: CDI_HQ,
        RfC: RFC,
        createdAt: new Date(),
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

function getMolecularWeight(pollutant: MeasuredParameters): number | undefined {
    switch (pollutant) {
        case MeasuredParameters.NO2:
            return 46;
        case MeasuredParameters.SO2:
            return 64;
        case MeasuredParameters.CO:
            return 28;
        case MeasuredParameters.O3:
            return 48;
        default:
            return undefined;
    }
}

function getContextValue(pollutants: Pollutant[], param: MeasuredParameters): number | undefined {
    const p = pollutants.find(p => p.pollutant === param);
    return p?.value;
}

function getRFC(pollutant: MeasuredParameters): number | undefined {
    switch (pollutant) {
        case MeasuredParameters.PM10:
            return 0.045;
        case MeasuredParameters.PM25:
            return 0.015;
        case MeasuredParameters.NO2:
            return 0.04;
        case MeasuredParameters.SO2:
            return 0.005;
        case MeasuredParameters.CO:
            return 3;
        case MeasuredParameters.O3:
            return 0.14;
        default:
            return undefined;
    }
}

export  {getRFC, calculateRisk, convertToMgPerM3, getContextValue, getMolecularWeight }