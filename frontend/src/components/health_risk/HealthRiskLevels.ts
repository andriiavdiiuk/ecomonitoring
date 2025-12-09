import styles from "frontend/components/health_risk/HealthRiskLevels.module.scss";

export function getCDIlevel(_cdi: number | null | undefined) {
    return {label: undefined, className: styles.none}
}

export function getHQlevel(hq: number | null | undefined) {
    if (hq == null || hq === 0) return { label: "none", className: styles.none }
    if (hq < 1) return { label: "acceptable", className: styles.level_acceptable }
    if (hq === 1) return { label: "borderline", className: styles.level_borderline }
    return { label: "unacceptable", className: styles.level_unacceptable }
}

export function getCRlevel(cr: number | null | undefined) {
    if (cr == null || cr === 0) return { label: "none", className: styles.none }
    if (cr < 1e-6) return { label: "minimal", className: styles.level_minimal }
    if (cr < 1e-4) return { label: "low", className: styles.level_low }
    if (cr < 1e-3) return { label: "medium", className: styles.level_medium }
    return { label: "high", className: styles.level_high }
}