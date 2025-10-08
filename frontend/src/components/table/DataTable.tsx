import {type JSX} from "react";
import styles from './DataTable.module.scss';

interface DataTableProps {
    header: string[];
    data: string[][];
    handleRowClick?: (row: string[], index: number, id: string|null) => void;
    rowIds?: string[];
}

export default function DataTable({header, data, rowIds, handleRowClick}: DataTableProps): JSX.Element {
    return (
        <>
            <table className={styles.table}>
                <thead>
                <tr>
                    {header.map((title, idx) => <th key={idx}>{title}</th>)}
                </tr>
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} onClick={handleRowClick ? () => {
                        handleRowClick(row, rowIndex, rowIds ? rowIds[rowIndex] : null);
                    } : undefined}>
                        {row.map((cell, colIndex) => <td key={colIndex}>{cell}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}