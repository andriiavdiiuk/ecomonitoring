import React, {type JSX, useState} from "react";
import styles from "./LoginUserPage.module.scss"
import userService from "frontend/services/UserService.ts";
import InputField from "frontend/components/input/InputField.tsx";
import axios from "axios";
import {mapValidationErrors, type ValidationErrorResponse} from "frontend/services/ValidationService.ts";
import { useNavigate } from 'react-router-dom';
import AppRoutes from "frontend/AppRoutes.tsx";
interface FormData {
    username: string,
    password: string,
    rememberme: boolean;
}

interface FormErrors {
    username: string[],
    password: string[],
    [key: string]: string[]
}


export default function LoginUserPage(): JSX.Element {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        rememberme: false,
    });

    const [error, setError] = useState<string | null>(null);
    const [errors, setFormErrors] = useState<FormErrors>();
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, type, value, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        }
        else
        {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!formData.username  || !formData.password) {
            setError('All fields are required');
            return;
        }

        userService
            .login(formData.username, formData.password, formData.rememberme)
            .then(async () => {
                setSuccess(true);
                setFormErrors(undefined);
                setError(null);
                await navigate(AppRoutes.Home);
            })
            .catch((err: unknown) => {
                if (axios.isAxiosError(err) && err.response?.data) {
                    setError(null);
                    const data = err.response.data as ValidationErrorResponse;


                    const fieldErrors: FormErrors = mapValidationErrors<FormErrors>(data.errors,{
                        username: [''],
                        password: [''],
                    });


                    setFormErrors(fieldErrors);

                }
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.center_container}>
                <h2 className={styles.title}>Login</h2>
                <form method="post" className={styles.form} onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>Login successful!</p>}

                    <InputField label={"Username:"}
                                name="username"
                                error={errors?.username}
                                value={formData.username}
                                onChange={handleChange}/>
                    <InputField label={"Password:"}
                                name="password"
                                type="password"
                                error={errors?.password}
                                value={formData.password}
                                onChange={handleChange}/>
                    <InputField label={"Remember Me?:"}
                                name="rememberme"
                                checked={formData.rememberme}
                                type="checkbox"
                                onChange={handleChange}/>

                    <button className={styles.button} type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}