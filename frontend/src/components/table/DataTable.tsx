import {Fragment, type JSX} from "react";
import styles from './DataTable.module.scss';

export interface TableRowData {
    row: (string | JSX.Element)[];
    beforeRow?: JSX.Element;
    afterRow?: JSX.Element;
    rowId?: string;
}

interface DataTableProps {
    header: string[];
    data: TableRowData[];
    handleRowClick?: (row: (string | JSX.Element)[], index: number, id: string|null) => void;
}

export default function DataTable({header, data, handleRowClick}: DataTableProps): JSX.Element {
    return (
        <>
            <table className={styles.table}>
                <thead>
                <tr>
                    {header.map((title, idx) => <th key={idx}>{title}</th>)}
                </tr>
                </thead>
                <tbody>
                {data.map((item, rowIndex) => (
                    <Fragment key={rowIndex}>
                    {item.beforeRow && (
                            <tr className={styles.beforeRow}>
                                <td colSpan={header.length}>{item.beforeRow}</td>
                            </tr>
                        )}
                    <tr className={styles.row} key={rowIndex} onClick={handleRowClick ? () => {
                        handleRowClick(item.row, rowIndex, item.rowId ? item.rowId : null);
                    } : undefined}>
                        {item.row.map((cell, colIndex) => <td key={colIndex}>{cell}</td>)}
                    </tr>
                        {item.afterRow && (
                            <tr className={styles.afterRow}>
                                <td colSpan={header.length}>{item.afterRow}</td>
                            </tr>
                        )}
                    </Fragment>
                ))}
                </tbody>
            </table>
        </>
    );
}