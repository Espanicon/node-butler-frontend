import styles from "../styles/appSection.module.css";
export default function AppSection({ activeSection }) {
  return (
    <div className={styles.main}>
      <p>Active section: {activeSection.label}</p>
    </div>
  );
}
