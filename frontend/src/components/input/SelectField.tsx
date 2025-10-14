import React, {type JSX, useId} from "react";
import styles from './SelectField.module.scss';

interface SelectFieldProps extends React.ComponentPropsWithoutRef<'select'> {
    label?: string;
    error?: string | string[];
}

function SelectField({label,error, children, className, ...props}: SelectFieldProps): JSX.Element {
    const generatedId:string = useId();

    let errorElements: JSX.Element | JSX.Element[] | null = null;
    if (error) {
        if (Array.isArray(error)) {
            errorElements = error.map((msg, i) => <span key={i}>{msg}</span>);
        } else {
            errorElements = <span>{error}</span>;
        }
    }

    const inputId:string = props.id || generatedId;
    return (
        <>
            <div className={[styles.field, className ].join(' ')} >
                { label && <label htmlFor={inputId} >{label}</label> }
                <select id={inputId}  {...props}>
                    {children}
                </select>
                {errorElements}
            </div>
        </>
    );
}


export default SelectField