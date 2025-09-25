export default class ValidationError extends Error {
    public fieldErrors: Array<Partial<Record<string, string | object>>> = []

    constructor(message: string, fieldErrors: Array<Partial<Record<string, string | object>>> = []) {
        super(message)
        this.fieldErrors = fieldErrors
    }
}