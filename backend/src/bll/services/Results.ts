
export type PaginationResult<T> = {
    stations: T,
    pagination: {
        page: number,
        limit: number
        total: number
        pages: number
    }
}