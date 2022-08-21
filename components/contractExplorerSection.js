import { useState, useEffect } from "react";
import styles from "../styles/contractExplorerSection.module.css";
import { Hr, loadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import utils from "../utils/utils";

const nodeButlerLib = new NodeButlerSDK();
const { getScoreApi } = nodeButlerLib;

export default function ContractExplorerSection({ localData }) {
  const [scoreInput, setScoreInput] = useState("");
  const [scoreData, setScoreData] = useState("** SCORE DATA **");
  const [scoreIsValid, setScoreIsValid] = useState(false);

  function handleScoreInputChange(evnt) {
    const value = evnt.target.value;

    if (utils.isValidScore(value)) {
      setScoreIsValid(true);
      if (scoreInput === value) {
        // if the new score is the same as the previous score do nothing
      } else {
        fetchScoreApi(value);
      }
    } else {
      setScoreIsValid(false);
    }
    setScoreInput(value);
  }

  async function fetchScoreApi(scoreAddress) {
    const scoreApi = await getScoreApi(scoreAddress);
    const parsedScore = utils.parseScore(scoreApi);
    setScoreData(parsedScore);
  }

  useEffect(() => {
    async function fetchInitialData() {
      //
    }

    // run initial data fetch
    fetchInitialData();
  }, []);
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
            className={
              scoreIsValid
                ? styles.input
                : `${styles.input} ${styles.inputInvalid}`
            }
          />
        </li>
      </ul>

      <p>SCORE details:</p>
      <textarea
        className={styles.textarea}
        value={scoreData}
        readOnly
      ></textarea>
    </div>
  );
}
