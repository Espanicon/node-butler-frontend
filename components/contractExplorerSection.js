import { useState, useEffect } from "react";
import styles from "../styles/contractExplorerSection.module.css";
import { Hr, loadingComponent } from "./customComponents";
import GenericModal from "./genericModal";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const nodeButlerLib = new NodeButlerSDK();
const { getScoreApi } = nodeButlerLib;

export default function ContractExplorerSection({ localData }) {
  const [scoreInput, setScoreInput] = useState("");
  const [scoreData, setScoreData] = useState(null);
  const [scoreIsValid, setScoreIsValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedMethodObj, setSelectedMethodObj] = useState(null);
  const [paramsInput, setParamsInput] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [txParamsIsValid, setTxparamsIsValid] = useState(false);

  function handleModalOnClose() {
    //
    setIsOpen(false);
  }

  function handleModalOnOpen() {
    //
    setIsOpen(true);
  }

  function handleSignTx() {
    handleModalOnOpen();
  }

  function handleScoreMethodSelected(evnt) {
    const selected = evnt.target.value;
    const selectedObj = scoreData.filter(method => method.name === selected)[0];
    setSelectedMethod(selected);
    setSelectedMethodObj(selectedObj);

    let paramsObj = {};
    if (selectedObj.inputs.length > 0) {
      selectedObj.inputs.map(param => {
        paramsObj[param.name] = "";
      });
      setParamsInput(paramsObj);
    }
  }

  function handleParamsInputChange(evnt) {
    //
    let value = evnt.target;
    console.log(value);
    setParamsInput(prevState => {
      let newParams = { ...prevState };
      newParams[evnt.target.name] = evnt.target.value;
      return newParams;
    });
  }

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
    setSelectedMethod("");
    setSelectedMethodObj(null);
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
        <ul>
          <li>
            <label htmlFor="scoreMethods">Select a method: </label>
            <select
              name="scoreMethods"
              id="scoreMethods"
              value={selectedMethod}
              onChange={handleScoreMethodSelected}
            >
              <option value="" selected disabled hidden>
                Choose method
              </option>
              {scoreData == null ? (
                <></>
              ) : (
                scoreData.map(eachMethod => {
                  if (eachMethod.type === "function") {
                    return (
                      <option key={uuidv4()} value={eachMethod.name}>
                        {eachMethod.name}
                      </option>
                    );
                  }
                })
              )}
            </select>
          </li>
        </ul>
      </div>
      <p>Params for selected SCORE method:</p>
      {selectedMethodObj == null ? (
        <ul>
          <li>** NO METHOD SELECTED **</li>
        </ul>
      ) : (
        <ul>
          {selectedMethodObj.inputs.length > 0 ? (
            selectedMethodObj.inputs.map((param, index) => {
              return (
                <li key={`${param.name}-${index}`}>
                  {param.name}:{" "}
                  <input
                    type="text"
                    name={param.name}
                    value={paramsInput[param.name]}
                    onChange={handleParamsInputChange}
                    placeholder={param.type}
                  />
                </li>
              );
            })
          ) : (
            <li>** NO PARAMS ** </li>
          )}
        </ul>
      )}
      <Hr />
      <h3>RPC JSON Object</h3>
      <p>
        A transaction will be signed with your installed wallet (ICONex or Hana)
        with the following RPC JSON Object, verify that the values are correct
        and click the button to sign the transaction.
      </p>
      <p>RPC JSON:</p>
      <textarea
        className={styles.textarea}
        value={
          txParamsIsValid
            ? "** RPC JSON IS VALID **"
            : "** RPC JSON NOT VALID **"
        }
        readOnly
      ></textarea>
      <button className={styles.button} onClick={handleSignTx}>
        Sign Tx
      </button>
    </div>
  );
}

function CustomModal({ isOpen, onClose }) {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose} useSmall={true}>
      <div className={styles.modalMain}></div>
    </GenericModal>
  );
}
