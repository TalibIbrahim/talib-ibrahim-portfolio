"use client";
import { socials } from "@/data/portfolio";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.credit}>
          Designed & built by <strong>Muhammad Talib Ibrahim</strong>
        </p>
        <div className={styles.links}>
          <a href={socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className={styles.sep}>·</span>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span className={styles.sep}>·</span>
          <a href={socials.email}>Email</a>
        </div>
        <p className={styles.copy}>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
