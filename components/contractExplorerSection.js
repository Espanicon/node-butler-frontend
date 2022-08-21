import { useState, useEffect } from "react";
import styles from "../styles/contractExplorerSection.module.css";
import { Hr, loadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const nodeButlerLib = new NodeButlerSDK();
const { getScoreApi } = nodeButlerLib;

export default function ContractExplorerSection({ localData }) {
  const [scoreInput, setScoreInput] = useState("");
  const [scoreData, setScoreData] = useState(null);
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
      fetchScoreApi(value);
    }
    setScoreInput(value);
  }

  async function fetchScoreApi(scoreAddress) {
    const scoreApi = await getScoreApi(scoreAddress);
    setScoreData(scoreApi);
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
        value={scoreIsValid ? utils.parseScore(scoreData) : "** SCORE DATA **"}
        readOnly
      ></textarea>
      <Hr />
      <h2>Sign contract method with logged wallet</h2>
      <p>Select method from the below dropdown list:</p>
      <div className={styles.scoreMethodSelection}>
        <label htmlFor="scoreMethods">Select a method: </label>
        <select name="scoreMethods" id="scoresMethods">
          {scoreData == null ? (
            <option value="null" disabled>
              METHODS
            </option>
          ) : (
            scoreData.map(eachMethod => {
              return (
                <option key={uuidv4()} value={eachMethod.name}>
                  {eachMethod.name}
                </option>
              );
            })
          )}
        </select>
      </div>
    </div>
  );
}
