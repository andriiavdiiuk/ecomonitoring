import {ProblemDetailErrors} from "common/Results";

export class ValidationError extends Error {
    public fieldErrors: ProblemDetailErrors<unknown> = []

    constructor(message: string, fieldErrors: ProblemDetailErrors<unknown> = []) {
        super(message)
        this.fieldErrors = fieldErrors
    }
}

export class UnathorizedError extends ValidationError {
    constructor(message: string, fieldErrors: ProblemDetailErrors<unknown> = []) {
        super(message, fieldErrors);
    }
};