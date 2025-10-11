import {ProblemDetailErrors} from "common/Results";
import {$ZodIssue} from "zod/v4/core";

export function pathArrayToObject<T>(
    path: PropertyKey[],
    message: string,
    result: ProblemDetailErrors<T> = {} as ProblemDetailErrors<T>
): ProblemDetailErrors<T> {
    let current: ProblemDetailErrors<T> = result;

    for (let i = 0; i < path.length; i++) {
        const segment = path[i];
        const isLast = i === path.length - 1;
        const key = segment as keyof typeof current;

        if (isLast) {
            if (!(key in current)) current[key] = [] as ProblemDetailErrors<T>[typeof key];
            (current[key] as string[]).push(message);
        } else {
            const nextSegment = path[i + 1];
            if (!(key in current)) {
                if (typeof nextSegment === "number") {
                    current[key] = [] as unknown as ProblemDetailErrors<T>[typeof key];
                } else {
                    current[key] = {} as ProblemDetailErrors<T>[typeof key];
                }
            }

            current = current[key] as ProblemDetailErrors<T>;
        }
    }

    return result;
}
function mergeErrors<T>(target: ProblemDetailErrors<T>, source: ProblemDetailErrors<T>) {
    for (const key in source) {
        const sourceValue = source[key as keyof typeof source];
        const targetValue = target[key as keyof typeof target];

        if (Array.isArray(sourceValue)) {
            if (!targetValue) target[key] = [] as ProblemDetailErrors<T>[typeof key];
            (target[key as keyof typeof target] as string[]).push(...sourceValue);
        } else if (sourceValue && typeof sourceValue === "object") {
            if (!targetValue) target[key] = {} as ProblemDetailErrors<T>[typeof key];
            mergeErrors(
                target[key as keyof typeof target] as ProblemDetailErrors<T>,
                sourceValue as ProblemDetailErrors<T>
            );
        }
    }
}

export function ZodErrorsToProblemDetailErrors<T>(issues: $ZodIssue[]): ProblemDetailErrors<T>
{
    const errors: ProblemDetailErrors<T> = {};
    for (const issue of issues) {

        const obj = pathArrayToObject(issue.path, issue.message);
        mergeErrors<T>(errors, obj);
    }

    return errors;
}