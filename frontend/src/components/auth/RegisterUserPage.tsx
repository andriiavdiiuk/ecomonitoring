import React, {type JSX, useState} from "react";
import styles from "./RegisterUserPage.module.scss"
import userService from "frontend/services/UserService.ts";
import InputField from "frontend/components/input/InputField.tsx";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import AppRoutes from "frontend/AppRoutes.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
import type {ProblemDetail, ProblemDetailErrors} from "common/Results.ts";
interface FormData {
    username: string,
    email: string,
    password: string,
}

export default function RegisterUserPage(): JSX.Element {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [errors, setFormErrors] = useState<ProblemDetailErrors<FormData>>();
    const [success, setSuccess] = useState<boolean>(false);
    const {setLoggedIn} = useUser();
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, type, value, checked } = e.target;
        if (type === 'checkbox') {
            console.log(checked);
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

        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required');
            return;
        }

        userService
            .register({
                username:formData.username,
                email: formData.email,
                password: formData.password})
            .then(async () => {
                setSuccess(true);
                setFormErrors(undefined);
                setError(null);
                setLoggedIn(true);
                await navigate(AppRoutes.Home);
            })
            .catch((err: unknown) => {
                if (axios.isAxiosError(err) && err.response?.data) {
                    setError(null);
                    const data = err.response.data as ProblemDetail<FormData>;

                    setFormErrors(data.errors);

                }
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.center_container}>
                <h2 className={styles.title}>Register</h2>
                <form method="post" className={styles.form} onSubmit={handleSubmit}>
                    {error && <p className={styles.error}>{error}</p>}
                    {success && <p className={styles.success}>Registration successful!</p>}

                    <InputField label={"Username:"}
                                name="username"
                                error={errors?.username}
                                value={formData.username}
                                onChange={handleChange}/>
                    <InputField label={"Email:"}
                                name="email"
                                error={errors?.email}
                                value={formData.email}
                                onChange={handleChange}/>
                    <InputField label={"Password:"}
                                name="password"
                                type="password"
                                error={errors?.password}
                                value={formData.password}
                                onChange={handleChange}/>

                    <button className={styles.button} type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}