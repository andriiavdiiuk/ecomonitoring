
export type PaginationResult<T> = {
    data: T,
    pagination: {
        page: number,
        limit: number
        total: number
        pages: number
    }
}