import { useState, useEffect, useRef } from "react";
import styles from "../styles/overviewSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import GenericModal from "./genericModal";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const ICON_LOGO = "/images/icon-logo.png";

const nodeButlerLib = new NodeButlerSDK();
const {
  getPrep,
  parsePrepData,
  getBonderList,
  getPrepFromNB,
  parsePrepFromNB,
  getPrepLogoUrl,
  setBonderList,
  getParsedTxResult,
  makeTxCallRPCObj,
  setPrep
} = nodeButlerLib;

// Constants
const initBonderForm = {
  bonder1: "",
  bonder2: "",
  bonder3: "",
  bonder4: "",
  bonder5: "",
  bonder6: "",
  bonder7: "",
  bonder8: "",
  bonder9: "",
  bonder10: ""
};

const initPrepDetailsForm = {
  name: "",
  email: "",
  country: "",
  city: "",
  website: "",
  details: "",
  nodeAddress: ""
};

const MAX_WAIT_PERIOD = 5;
const initialTxResultState = {
  txExists: false
};

const {
  parseBonderFormInputs,
  parsePrepFormInputs,
  samples,
  isValidICONAddress
} = utils;
const { details: CODE, setPrep: SETPREP, details2: DETAILSJSON } = samples;

export default function OverviewSection({ localData, userIsPrep, children }) {
  const [prepLogo, setPrepLogo] = useState(null);
  // const [overviewState, setOverviewState] = useState(initPrepDetailsForm);
  const [overviewState, setOverviewState] = useState(null);
  const [prepDetailsState, setPrepDetailsState] = useState(null);
  const [bondedInfoState, setBondedInfoState] = useState(null);
  const [txResults, setTxResults] = useState(initialTxResultState);
  const [bonderForm, setBonderForm] = useState(initBonderForm);
  const [prepDetailsForm, setPrepDetailsForm] = useState(initPrepDetailsForm);
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false);
  const [walletResponse, setWalletResponse] = useState(null);

  let txRef = useRef(null);
  let countdownRef = useRef(0);

  function handleWalletModalOnClose() {
    setWalletModalIsOpen(false);
    setWalletResponse(null);
    setTxResults(initialTxResultState);
    handleClearInterval();
  }

  function setImgError(evnt) {
    evnt.currentTarget.src = ICON_LOGO;
  }

  function handleFormInputChange(evnt) {
    const value = evnt.target.value;
    setBonderForm(bonderState => {
      let newState = { ...bonderState };
      newState[evnt.target.name] = value;

      return newState;
    });
  }
  function dispatchTxEvent(txData) {
    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_JSON-RPC",
          payload: txData
        }
      })
    );
    // open modal window to show result of wallet tx request
    setWalletModalIsOpen(true);
  }

  function handleBonderFormSubmit() {
    handleFormSubmit("bond");
  }

  function handlePrepFormSubmit() {
    handleFormSubmit("prep");
  }

  function handleFormSubmit(type) {
    if (localData.auth.successfulLogin) {
      let inputData = null;
      let txData = null;

      switch (type) {
        case "bond":
          inputData = parseBonderFormInputs(bonderForm);
          txData = setBonderList(localData.auth.selectedWallet, inputData);
          break;
        case "prep":
          inputData = parsePrepFormInputs(prepDetailsForm);

          if (inputData == null) {
          } else {
            txData = setPrep(localData.auth.selectedWallet, inputData);
          }
          break;
        default:
          break;
      }

      // dispatch event to wallet
      if (txData == null) {
        alert("Data for transaction is invalid");
      } else {
        dispatchTxEvent(txData);
      }
    } else {
      alert("Please login first to be able t sign tx with your wallet");
    }
  }

  function handlePrepFormInputChange(evnt) {
    const value = evnt.target.value;
    setPrepDetailsForm(prepFormState => {
      let newState = { ...prepFormState };
      newState[evnt.target.name] = value;

      return newState;
    });
  }

  // function handleTxResult(txResults) {
  //   console.log("tx result");
  //   console.log(txResults);

  //   if (txResults.isError === true) {
  //     setTxResults(txResults.message);
  //   } else {
  //     setTxResults(JSON.stringify(txResults.result));
  //   }
  // }

  function handleClearInterval() {
    try {
      countdownRef.current = 0;
      clearInterval(txRef.current);
    } catch (err) {
      console.log("error trying to clear interval");
      console.log(err);
    }
  }

  useEffect(() => {
    if (
      txResults.txExists === true ||
      countdownRef.current >= MAX_WAIT_PERIOD
    ) {
      handleClearInterval();
    }
  }, [txResults]);

  useEffect(() => {
    if (walletResponse == null) {
    } else {
      if (walletResponse.isError === true) {
      } else {
        txRef.current = setInterval(async () => {
          const txData = await getParsedTxResult(walletResponse.result);
          setTxResults(txData);

          countdownRef.current += 1;
        }, 1000);
      }
    }

    // returns function to clear interval on component dismount
    return () => {
      if (txRef.current == null) {
      } else {
        handleClearInterval();
      }
    };
  }, [walletResponse]);

  useEffect(() => {
    async function runAsync() {
      const loggedPrep = localData.auth.successfulLogin
        ? localData.auth.selectedWallet
        : null;
      // get overall prep data
      const prepData = await getPrep(loggedPrep);
      const parsedPrepData = parsePrepData(prepData);

      // get bonder data
      const bonderList = await getBonderList(localData.auth.selectedWallet);
      const parsedBonderList = utils.parseGetBonderList(bonderList);

      // get prep details data
      // TODO: uncomment after testing
      const prepDetails = await getPrepFromNB(loggedPrep);
      let prepLogoUrl = null;

      if (prepDetails == null) {
      } else {
        const parsedPrepDetails = parsePrepFromNB(prepDetails);
        prepLogoUrl = getPrepLogoUrl(parsedPrepDetails);
      }

      // get prep logo data
      setPrepLogo(prepLogoUrl);

      // update states
      setOverviewState(parsedPrepData);
      setBondedInfoState(parsedBonderList);
    }

    // run async fetch
    runAsync();

    // define wallet event listener
    function handleWalletResponse(response) {
      setWalletResponse(response);
    }

    function runWalletEventListener(evnt) {
      utils.customWalletEventListener(
        evnt,
        handleWalletResponse,
        null,
        null,
        handleWalletModalOnClose
      );
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
    <div>
      {userIsPrep === true ? (
        <div className={styles.main}>
          <h2>Overview</h2>
          {overviewState === null ? (
            <LoadingComponent />
          ) : (
            <div className={styles.topSection}>
              <div className={styles.topSectionInfo}>
                <p>{`Node name: ${overviewState.name}`}</p>
                <p>{`Node address: ${overviewState.address}`}</p>
                <p>{`Country: ${overviewState.country}`}</p>
                <p>{`Email: ${overviewState.email}`}</p>
                <p>
                  {`Details.json: `}
                  <a href={overviewState.details} target="_blank">
                    {overviewState.details}
                  </a>
                </p>
              </div>
              <div className={styles.topSectionLogo}>
                <img
                  src={prepLogo === null ? ICON_LOGO : prepLogo}
                  onError={setImgError}
                />
              </div>
            </div>
          )}
          <Hr />
          <h2>PRep Details:</h2>
          {overviewState === null ? (
            <LoadingComponent />
          ) : (
            <div className={styles.bottomSection}>
              <div className={styles.bottomSectionRow}>
                <p>Grade: {overviewState.grade}</p>
                <p>Status: {overviewState.status}</p>
                <p>Penalty: {overviewState.penalty}</p>
                <p>Delegated: {overviewState.delegated}</p>
                <p>Bond: {overviewState.bonded}</p>
                <p>Power: {overviewState.power}</p>
              </div>
              <div className={styles.bottomSectionRow}>
                <p>Irep: {overviewState.irep}</p>
                <p>
                  irepUpdateBlockHeight: {overviewState.irepUpdateBlockHeight}
                </p>
                <p>lastHeight: {overviewState.lastHeight}</p>
                <p>totalBlocks: {overviewState.totalBlocks}</p>
                <p>validatedBlocks: {overviewState.validatedBlocks}</p>
                <p>p2pEndpoint: {overviewState.p2pEndpoint}</p>
              </div>
            </div>
          )}
          <Hr />
          <div className={styles.defaultSection}>
            <h2>Bonded Info:</h2>
            <p>
              A maximum of 10 addresses are allowed to be added to the{" "}
              <i>bonderList</i> of your node. You can use the following form to
              update your <i>bonderList</i> configuration, a transaction will be
              signed with your address using your preffered wallet software, the
              details of the transaction will be shown in the wallet popup
              window before approving the transaction.
            </p>
            <p>Current wallets allowed to place bond for your node:</p>
            {bondedInfoState === null ? (
              <LoadingComponent />
            ) : (
              <ul>
                {bondedInfoState.map(wallet => {
                  return (
                    <li key={uuidv4()}>
                      <a href={utils.parseBonderWallet(wallet)} target="_blank">
                        {wallet}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className={styles.setPrepForm}>
              <div
                style={{
                  display: "flex",
                  flexFlow: "column nowrap",
                  alignSelf: "center"
                }}
              >
                <div className={styles.table}>
                  {[
                    ["bonder1", bonderForm.bonder1, "Bonder 1:"],
                    ["bonder2", bonderForm.bonder2, "Bonder 2:"],
                    ["bonder3", bonderForm.bonder3, "Bonder 3:"],
                    ["bonder4", bonderForm.bonder4, "Bonder 4:"],
                    ["bonder5", bonderForm.bonder5, "Bonder 5:"],
                    ["bonder6", bonderForm.bonder6, "Bonder 6:"],
                    ["bonder7", bonderForm.bonder7, "Bonder 7:"],
                    ["bonder8", bonderForm.bonder8, "Bonder 8:"],
                    ["bonder9", bonderForm.bonder9, "Bonder 9:"],
                    ["bonder10", bonderForm.bonder10, "Bonder 10:"]
                  ].map((arrItem, index) => {
                    return (
                      <div
                        key={`bonder-item-${index}`}
                        className={styles.tableRow}
                      >
                        <p className={styles.tableRowLabel}>
                          <b>{arrItem[2]}</b>
                        </p>
                        <input
                          type="text"
                          name={arrItem[0]}
                          value={arrItem[1]}
                          onChange={handleFormInputChange}
                          className={
                            isValidICONAddress(arrItem[1]) === true
                              ? `${styles.tableRowInput} ${styles.tableRowInputValid}`
                              : `${styles.tableRowInput} ${styles.tableRowInputInvalid}`
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  className={styles.button}
                  onClick={handleBonderFormSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <Hr />
          </div>
          <div className={styles.defaultSection}>
            <h2>Details.json:</h2>
            <p>
              The{" "}
              <a
                href="https://docs.icon.community/v/icon1/references/reference-manuals/json-standard-for-p-rep-detailed-information"
                target="_blank"
              >
                <b>details.json</b>
              </a>{" "}
              is a file that you can defined in your Prep on-chain data, it will
              be used by third parties to fetch information about your node. Use
              the following format and put the file in a route accesible on the
              internet (you can host it on your team website, github, etc) and
              then update your Prep settings with a link to it.
            </p>
            <div className={styles.codeBlockContainer2}>
              <pre className={styles.codeBlockPre}>{CODE}</pre>
            </div>
            <Hr />
          </div>
          <div className={styles.defaultSection}>
            <h2>Update Prep on-chain data:</h2>
            <p>
              <a
                href="https://docs.icon.community/icon-stack/client-apis/json-rpc-api/v3#setprep"
                target="_blank"
              >
                Prep on-chain data
              </a>{" "}
              can be updated according to the following format:
            </p>
            <div className={styles.codeBlockContainer2}>
              <pre className={styles.codeBlockPre}>{SETPREP}</pre>
            </div>
            <p>
              Use the following form to update your Prep data, a transaction
              will be signed with your node address using your preferred wallet,
              you can see the details of the transaction before submitting it in
              the wallet popup window.
            </p>
            <div className={styles.setPrepForm}>
              <div
                style={{
                  display: "flex",
                  flexFlow: "column nowrap",
                  alignSelf: "center"
                }}
              >
                <div className={styles.table}>
                  {[
                    ["name", prepDetailsForm.name, "Name:"],
                    ["email", prepDetailsForm.email, "Email:"],
                    ["country", prepDetailsForm.country, "Country:"],
                    ["city", prepDetailsForm.city, "City:"],
                    ["website", prepDetailsForm.website, "Website:"],
                    ["details", prepDetailsForm.details, "Details:"],
                    ["nodeAddress", prepDetailsForm.nodeAddress, "nodeAddress:"]
                  ].map((arrItem, index) => {
                    return (
                      <div
                        key={`prep-item-${index}`}
                        className={styles.tableRow}
                      >
                        <p className={styles.tableRowLabel}>
                          <b>{arrItem[2]}</b>
                        </p>
                        <input
                          type="text"
                          placeholder={
                            overviewState == null ||
                            overviewState[arrItem[0]] == null
                              ? ""
                              : `${overviewState[arrItem[0]]}`
                          }
                          name={arrItem[0]}
                          value={arrItem[1]}
                          onChange={handlePrepFormInputChange}
                        />
                      </div>
                    );
                  })}
                </div>
                <button
                  className={styles.button}
                  onClick={handlePrepFormSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>{children}</div>
      )}
      <WalletResponseModal
        isOpen={walletModalIsOpen}
        onClose={handleWalletModalOnClose}
        txData={txResults}
        walletResponse={walletResponse}
      />
    </div>
  );
}

function WalletResponseModal({ isOpen, onClose, txData, walletResponse }) {
  useEffect(() => {
    console.log("wallet response and txData");
    console.log(walletResponse);
    console.log(txData);
  }, [txData]);

  return (
    <GenericModal isOpen={isOpen} onClose={onClose} useSmall={true}>
      <div className={styles.modalContainer}>
        {walletResponse == null ? (
          <LoadingComponent />
        ) : (
          <>
            <h2>Transaction Result</h2>
            <p>Transaction State: {txData.status ? "SUCCESS" : "FAILED"}</p>
            <p>Transaction hash: {txData.txHash}</p>
          </>
        )}
      </div>
    </GenericModal>
  );
}
