import {type JSX} from "react";
import styles from './Headers.module.scss';
import {Link} from "react-router-dom";
import AppRoutes from "frontend/AppRoutes.tsx";
import {useUser} from "frontend/components/auth/UserContext.tsx";
export default function Header(): JSX.Element {
    const {loggedIn} = useUser();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <h1 className={styles.title}>EcoMonitoring</h1>
                <nav className={styles.nav}>
                    <Link to={AppRoutes.Home}>Home</Link>
                    <Link to={AppRoutes.Stations}>Stations</Link>
                    <div className={styles.spacer}/>
                    {!loggedIn &&
                        <>
                            <Link to={AppRoutes.Register}>Register</Link>
                            <Link to={AppRoutes.Login}>Login</Link>
                        </>
                    }
                    {loggedIn &&
                        <>
                            <Link to={AppRoutes.Logout}>Logout</Link>
                        </>
                    }
                </nav>
            </div>
        </header>
    );
}
