import { useState } from "react";
import styles from "../styles/overviewSection.module.css";

const MOCK_DATA = {
  logo: "/images/icon-logo.png",
  name: "Fun node",
  address: "hx34e2023a4..",
  country: "US",
  email: "foo@bar.com",
  details: "https;//banana.com/detail.json",
  grade: "Main",
  status: "Active",
  penalty: "none",
  delegated: 324050,
  bond: 20000,
  power: 364555,
  irep: 14000,
  irepUpdateBlockHeight: 15634955,
  lastHeight: 52231259,
  totalBlocks: 517449,
  validatedBlocks: 514433,
  p2pEndpoint: "127.0.0.1:9000"
};

function Hr() {
  return (
    <div
      style={{ height: "2px", width: "100%", backgroundColor: "#d6d3d1" }}
    ></div>
  );
}
export default function OverviewSection({ activeSection }) {
  const [prepLogo, setPrepLogo] = useState(null);
  return (
    <div className={styles.main}>
      <h2>Overview</h2>
      <div className={styles.topSection}>
        <div className={styles.topSectionInfo}>
          <p>Node name: {MOCK_DATA.name}</p>
          <p>Node address: {MOCK_DATA.address}</p>
          <p>Country: {MOCK_DATA.country}</p>
          <p>Email: {MOCK_DATA.email}</p>
          <p>Details.json: {MOCK_DATA.details}</p>
        </div>
        <div className={styles.topSectionLogo}>
          <img src={prepLogo === null ? "/images/icon-logo.png" : ""} />
        </div>
      </div>
      <Hr />
      <h2>PRep Details:</h2>
      <div className={styles.bottomSection}>
        <div className={styles.bottomSectionRow}>
          <p>Grade: {MOCK_DATA.grade}</p>
          <p>Status: {MOCK_DATA.status}</p>
          <p>Penalty: {MOCK_DATA.penalty}</p>
          <p>Delegated: {MOCK_DATA.delegated}</p>
          <p>Bond: {MOCK_DATA.bond}</p>
          <p>Power: {MOCK_DATA.power}</p>
        </div>
        <div className={styles.bottomSectionRow}>
          <p>Irep: {MOCK_DATA.irep}</p>
          <p>irepUpdateBlockHeight: {MOCK_DATA.irepUpdateBlockHeight}</p>
          <p>lastHeight: {MOCK_DATA.lastHeight}</p>
          <p>totalBlocks: {MOCK_DATA.totalBlocks}</p>
          <p>validatedBlocks: {MOCK_DATA.validatedBlocks}</p>
          <p>p2pEndpoint: {MOCK_DATA.p2pEndpoint}</p>
        </div>
      </div>
      <Hr />
      <h2>Bonded Info:</h2>
      <Hr />
      <h2>Details.json:</h2>
    </div>
  );
}
