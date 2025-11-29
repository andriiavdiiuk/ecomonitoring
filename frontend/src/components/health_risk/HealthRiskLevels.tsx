import {type JSX} from "react";
import styles from "frontend/components/health_risk/HealthRiskLevels.module.scss"
import type {HealthRisk} from "common/entities/HealthRisk.ts";

export default function HealthRiskLevels(props: {risk: HealthRisk | null}): JSX.Element | (null) {
    if (!props.risk) return (null);
    function getHQlevel(hq: number | null | undefined) {
        if (hq == null || hq == 0) return {label: "none", className: "none"};
        if (hq < 1) return {label: "acceptable", className: "level_acceptable"};
        if (hq === 1) return {label: "borderline", className: "level_borderline"};
        return {label: "unacceptable", className: "level_unacceptable"};
    }

    function getCRlevel(cr: number | null | undefined) {
        if (cr == null || cr == 0) return {label: "none", className: "none"};
        if (cr < 1e-6) return {label: "minimal", className: "level_minimal"};
        if (cr < 1e-4) return {label: "low", className: "level_low"};
        if (cr < 1e-3) return {label: "medium", className: "level_medium"};
        return {label: "high", className: "level_high"};
    }

    const formatValue = (num?: number) => {
        if (num === undefined) return '';
        return Number(num.toPrecision(3)).toString();
    }


    const hqInfo = getHQlevel(props.risk.HQ);
    const crInfo = getCRlevel(props.risk.CR);

    return (
        <>
            <div className={[styles.hq, styles[hqInfo.className]].join(' ')}>
                Hazard quotient (HQ): {formatValue(props.risk.HQ)} ({hqInfo.label})
            </div>

            <div className={[styles.cr, styles[crInfo.className]].join(' ')}>
                Carcinogenic risk (CR): {formatValue(props.risk.CR)} ({crInfo.label})
            </div>
        </>
    )
}
