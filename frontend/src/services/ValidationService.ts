export interface ValidationErrorItem {
    [field: string]: string;
}

export type FormErrors<T> = {
    [K in keyof T]: T[K] extends object ? FormErrors<T[K]> : string[]
}

export interface ValidationErrorResponse {
    type: string;
    status: number;
    title: string;
    detail: string;
    instance: string;
    errors: ValidationErrorItem[];
}


export function mapValidationErrors<T>(
    errors: Array<Record<string, string>>
): FormErrors<T> {
    const result:FormErrors<T> = {} as FormErrors<T>;

    for (const item of errors) {
        const [key, value] = Object.entries(item)[0] ?? []
        if (!key || !value) continue

        const path = key.split(".")
        let current: FormErrors<T> = result

        for (let i = 0; i < path.length; i++) {
            const segment = path[i]
            const isLast = i === path.length - 1
            const k = segment as keyof typeof current

            if (isLast) {
                if (!(k in current)) current[k] = [] as FormErrors<T>[typeof k];
                (current[k] as string[]).push(value);
            } else {
                if (!(k in current)) current[k] = [] as FormErrors<T>[typeof k];
                current = current[k] as FormErrors<T>;
            }
        }
    }

    return result
}