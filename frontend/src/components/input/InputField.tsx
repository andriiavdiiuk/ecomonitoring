import React, {type JSX, useId} from "react";
import styles from "frontend/components/input/InputField.module.scss";
interface TextFieldProps extends React.ComponentPropsWithoutRef<'input'> {
    label?: string;
    error?: string | string[];
}


function InputField({label, error, ...props}: TextFieldProps): JSX.Element {
    let fieldClass = '';
    switch (props.type) {
        case 'radio':
        case 'checkbox':
            fieldClass += ` ${styles.checkbox_field}`;
            break;
        case 'text':
        case 'password':
        default:
            fieldClass += ` ${styles.field}`;
            break;
    }

    let errorElements: JSX.Element | JSX.Element[] | null = null;
    if (error) {
        if (Array.isArray(error)) {
            errorElements = error.map((msg, i) => <span key={i}>{msg}</span>);
        } else {
            errorElements = <span>{error}</span>;
        }
    }

    const generatedId:string = useId();
    const inputId:string = props.id || generatedId;

    return (
        <>
            <div className={fieldClass}>
                <label htmlFor={inputId} >{label}</label>
                <input id={inputId}  {...props} />
                {errorElements}
            </div>
        </>
    );
}


export default InputField