import { useState, useEffect } from "react";
import styles from "../styles/contractExplorerSection.module.css";
import { Hr, loadingComponent } from "./customComponents";
import GenericModal from "./genericModal";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const nodeButlerLib = new NodeButlerSDK();
const {
  getScoreApi,
  makeTxCallRPCObj,
  makeICXCallRequestObj,
  scores,
  makeICXSendTxRequestObj,
  preFormatRPCJSON,
  USE_NID
} = nodeButlerLib;

// const USE_NID = scores.nid.mainnet;

export default function ContractExplorerSection({ localData, userIsPrep }) {
  const [scoreInput, setScoreInput] = useState("");
  const [scoreData, setScoreData] = useState(null);
  const [scoreIsValid, setScoreIsValid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedMethodIsReadOnly, setSelectedMethodIsReadOnly] = useState(
    null
  );
  const [selectedMethodObj, setSelectedMethodObj] = useState(null);
  const [paramsInput, setParamsInput] = useState({});
  const [txParamsIsValid, setTxParamsIsValid] = useState(false);
  const [txParamsData, setTxParamsData] = useState(null);
  const [txResultHash, setTxResultHash] = useState(null);
  const [txResults, setTxResults] = useState(null);
  const [walletResponseIsOpen, setWalletResponseIsOpen] = useState(false);

  function handleWalletResponseOnClose() {
    setWalletResponseIsOpen(false);
  }

  function dispatchTxEvent(txData) {
    console.log("txData");
    console.log(txData);
    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_JSON-RPC",
          payload: txData
        }
      })
    );
    // open modal window to show result of wallet tx request
    // setWalletTxModalIsOpen(true)
  }

  function handleSignTx() {
    if (localData.auth.successfulLogin) {
      // if user is logged
      const txData = txParamsData;
      // const formattedRPCJSON = preFormatRPCJSON(
      //   txData,
      //   localData.auth.selectedWallet
      // );
      // dispatchTxEvent(formattedRPCJSON);
      dispatchTxEvent(txData);
      // setWalletResponseIsOpen(true);
    } else {
      alert("Please login first to be able t sign tx with your wallet");
    }
  }

  function handleScoreMethodSelected(evnt) {
    const selected = evnt.target.value;
    const selectedObj = scoreData.filter(method => method.name === selected)[0];
    let paramsObj = {};
    let methodIsReadonly = true; //TODO: should default be true?

    // get the methods params
    if (selectedObj.inputs.length > 0) {
      selectedObj.inputs.map(param => {
        paramsObj[param.name] = "";
      });
    }

    // get if the method is readonly or not
    if (selectedObj.readonly == null || selectedObj.readonly === "0x0") {
      methodIsReadonly = false;
    } else if (selectedObj.readonly === "0x1") {
      methodIsReadonly = true;
    } else {
      // should never happen
    }

    // set selected method and method object
    setSelectedMethod(selected);
    setSelectedMethodObj(selectedObj);

    // set method params
    setParamsInput(paramsObj);
    setTxParamsIsValid(true);

    // set if the method is readonly or not
    setSelectedMethodIsReadOnly(methodIsReadonly);

    // pass the method object to build the JSON RPC
    // handleRPCJSONObjChange(selectedObj, paramsObj);
  }

  function handleRPCJSONObjChange(scoreMethodObj, paramsObj = null) {
    //
    let txObj = null;
    let formattedRPCJSON = null;
    let isReadonly =
      selectedMethodIsReadOnly === true || selectedMethodIsReadOnly == null
        ? true
        : false;
    if (isReadonly === true) {
      // if this is a readonly method
      txObj = makeICXCallRequestObj(
        scoreMethodObj.name,
        paramsObj,
        null,
        scoreInput,
        false
      );
      formattedRPCJSON = preFormatRPCJSON(
        txObj,
        localData.auth.selectedWallet,
        isReadonly
      );
    } else {
      // if the method is not readonly (it has method params)
      // txObj = makeICXSendTxRequestObj(
      //   scoreMethodObj.name,
      //   paramsObj,
      //   null,
      //   scoreInput,
      //   false
      // );
      txObj = makeTxCallRPCObj(
        localData.auth.selectedWallet,
        scoreInput,
        scoreMethodObj.name,
        paramsObj,
        USE_NID
      );
      formattedRPCJSON = txObj;
    }

    console.log("tx object");
    console.log(isReadonly);
    console.log(txObj);
    console.log(formattedRPCJSON);
    // formattedRPCJSON = preFormatRPCJSON(
    //   txObj,
    //   localData.auth.selectedWallet,
    //   isReadonly
    // );
    setTxParamsData(formattedRPCJSON);
    // setTxParamsIsValid(true);
  }

  function handleParamsInputChange(evnt) {
    //
    let value = evnt.target;
    setParamsInput(prevState => {
      let newParams = { ...prevState };
      newParams[evnt.target.name] = evnt.target.value;
      return newParams;
    });
  }

  function handleScoreValidation(boolValidation) {
    setScoreIsValid(boolValidation);
    setTxParamsIsValid(false);
    setTxParamsData(null);

    if (!boolValidation) {
    }
  }
  function handleScoreInputChange(evnt) {
    const value = evnt.target.value;

    if (utils.isValidScore(value)) {
      handleScoreValidation(true);
      if (scoreInput === value) {
        // if the new score is the same as the previous score do nothing
      } else {
        fetchScoreApi(value);
      }
    } else {
      handleScoreValidation(false);
      fetchScoreApi(value);
    }
    setScoreInput(value);

    // reset the following states to their initial value
    setSelectedMethod("");
    setSelectedMethodObj(null);
    setSelectedMethodIsReadOnly(null);
    setTxResults(null);
    setTxResultHash(null);
  }

  async function fetchScoreApi(scoreAddress) {
    const scoreApi = await getScoreApi(scoreAddress);
    setScoreData(scoreApi);
  }

  function handleTxResult(txResult) {
    //
    console.log("tx result");
    console.log(txResult);

    if (txResult.isError === true) {
      setTxResults(txResult.message);
    } else {
      setTxResults(JSON.stringify(txResult.result));
    }
  }

  useEffect(() => {
    //
    if (selectedMethodObj == null) {
      // if tx params are null do nothing
    } else {
      handleRPCJSONObjChange(selectedMethodObj, paramsInput);
    }
  }, [selectedMethodObj, paramsInput]);

  useEffect(() => {
    // TODO: set the logic to handle the wallet events here
    function runWalletEventListener(evnt) {
      utils.customWalletEventListener(evnt, handleTxResult);
    }
    // create event listener for Hana and ICONex wallets
    window.addEventListener("ICONEX_RELAY_RESPONSE", runWalletEventListener);

    // return the following function to perform cleanup of the event
    // listener on component unmount
    return function removeCustomEventListener() {
      window.removeEventListener(
        "ICONEX_RELAY_RESPONSE",
        runWalletEventListener
      );
    };
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
              <option value="" disabled>
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
      <h3>RPC JSON Request</h3>
      <p>
        A transaction will be signed with your installed wallet (ICONex or Hana)
        with the following RPC JSON Object, verify that the values are correct
        and click the button to sign the transaction.
      </p>
      <p>RPC JSON:</p>
      <textarea
        className={`${styles.textarea} ${styles.textareaRPCJSON}`}
        value={
          txParamsIsValid
            ? `${JSON.stringify(txParamsData)}`
            : "** RPC JSON NOT VALID **"
        }
        readOnly
      ></textarea>
      <button
        className={styles.button}
        onClick={handleSignTx}
        disabled={!txParamsIsValid}
        // disabled={true}
      >
        Sign Tx
      </button>
      <Hr />
      <h3>RPC JSON Response</h3>
      <p>TX Result hash: {txResultHash == null ? "null" : txResultHash}</p>
      <textarea
        className={`${styles.textarea} ${styles.textareaRPCJSON}`}
        value={txResults == null ? "** RPC JSON RESULT**" : `${txResults}`}
        readOnly
      ></textarea>
      {/* <WalletResponseModal */}
      {/*   isOpen={walletResponseIsOpen} */}
      {/*   onClose={handleWalletResponseOnClose} */}
      {/* /> */}
    </div>
  );
}

function WalletResponseModal({ isOpen, onClose }) {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose} useSmall={true}>
      <div>
        <h2>test on modal</h2>
      </div>
    </GenericModal>
  );
}
