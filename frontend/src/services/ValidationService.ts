export interface ValidationErrorItem {
    [field: string]: string;
}

export interface ValidationErrorResponse {
    type: string;
    status: number;
    title: string;
    detail: string;
    instance: string;
    errors: ValidationErrorItem[];
}

type Writable<T> = { -readonly [K in keyof T]: T[K] };

export function mapValidationErrors<T extends Record<string, string[]>>(
    errors: Array<Record<string, string>>,
    defaults: T
): T {
    const result: Writable<T> = { ...defaults };

    errors.forEach(item => {
        const [key, value] = Object.entries(item)[0] ?? [];
        if (key && value && key in result) {
            const fieldKey = key as keyof T;
            result[fieldKey] = [...result[fieldKey], value] as T[typeof fieldKey];
        }
    });

    return result as T;
}

