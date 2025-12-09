import {type JSX} from "react";
import styles from "frontend/components/health_risk/HealthRiskLevel.module.scss"

export default function HealthRiskLevel({label, value, getLevel}: {
    label: string
    value: number | null | undefined
    getLevel?: (v: number | null | undefined) => { label: string | null | undefined; className: string | null | undefined }
}): JSX.Element {

    const info = (getLevel?.(value)) ?? undefined;

    function formatValue(num: number | null | undefined)
    {
        if (num === undefined || num === null)
        {
            return ""
        }
        return Number(num.toPrecision(3)).toString()
    }

    return (
        <div className={[styles.risk ,info?.className].join(" ")}>
            {label}: {formatValue(value)}  { info?.label && `(${info.label})` }
        </div>
    )
}
