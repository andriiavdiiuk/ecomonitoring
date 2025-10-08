import React, {type JSX, useId} from "react";
import styles from './SelectField.module.scss';

interface SelectFieldProps extends React.ComponentPropsWithoutRef<'select'> {
    label?: string;
}

function SelectField({label, children, className, ...props}: SelectFieldProps): JSX.Element {
    const generatedId:string = useId();
    const inputId:string = props.id || generatedId;
    return (
        <>
            <div className={[styles.field, className ].join(' ')} >
                { label && <label htmlFor={inputId} >{label}</label> }
                <select id={inputId}  {...props}>
                    {children}
                </select>
            </div>
        </>
    );
}


export default SelectField