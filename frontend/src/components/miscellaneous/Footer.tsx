import styles from './Footer.module.scss';
import {type JSX} from "react";

export default function Footer(): JSX.Element {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>Footer</div>
        </footer>
    );
};
