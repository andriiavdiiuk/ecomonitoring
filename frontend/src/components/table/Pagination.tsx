import {type JSX} from "react";
import styles from "frontend/components/table/DataTablePagination.module.scss";

interface DataTablePaginationProps {
    currentPage: number
    totalPages: number
    onPageChange?: (page: number) => void
}

export default function Pagination({currentPage, totalPages, onPageChange}: DataTablePaginationProps): JSX.Element {
    return (
        <div className={styles.pagination}>
            <button
                onClick={() => onPageChange?.(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    )
}
