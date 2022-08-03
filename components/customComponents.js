import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/customComponents.module.css";

export function Hr() {
  return (
    <div
      style={{ height: "2px", width: "100%", backgroundColor: "#d6d3d1" }}
    ></div>
  );
}

export function LoadingComponent() {
  return (
    <div className={styles.imgLoading}>
      {[1, 2, 3, 4, 5].map(foo => (
        <div className={styles.imgLoadingItem} key={uuidv4()}></div>
      ))}
    </div>
  );
}
