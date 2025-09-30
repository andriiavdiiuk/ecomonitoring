export class ValidationError extends Error {
    public fieldErrors: Array<Partial<Record<string, string | object>>> = []

    constructor(message: string, fieldErrors: Array<Partial<Record<string, string | object>>> = []) {
        super(message)
        this.fieldErrors = fieldErrors
    }
}

export class UnathorizedError extends ValidationError {
    constructor(message: string, fieldErrors: Array<Partial<Record<string, string | object>>> = []) {
        super(message, fieldErrors);
    }
};