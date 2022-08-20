import { useState } from "react";
import styles from "../styles/contractExplorerSection.module.css";
import { Hr } from "./customComponents";

const MOCK_DATA = {
  textarea: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur
        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
        qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.`
};
export default function ContractExplorerSection({ localData }) {
  const [scoreInput, setScoreInput] = useState("");
  const [scoreData, setScoreData] = useState(MOCK_DATA.textarea);

  function handleScoreInputChange(evnt) {
    const value = evnt.target.value;
    setScoreInput(value);
  }
  return (
    <div className={styles.main}>
      <h2>Contract Explorer</h2>
      <p>Add an ICON smart contract address (SCORE) in the following input.</p>
      <ul>
        <li>
          SCORE Address:{" "}
          <input
            type="text"
            name="scoreInput"
            value={scoreInput}
            onChange={handleScoreInputChange}
          />
        </li>
      </ul>

      <p>SCORE details:</p>
      <textarea className={styles.textarea}>{scoreData}</textarea>
    </div>
  );
}
