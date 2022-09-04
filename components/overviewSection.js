import { useState, useEffect } from "react";
import styles from "../styles/overviewSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const ICON_LOGO = "/images/icon-logo.png";

const nodeButlerLib = new NodeButlerSDK("api.espanicon.team");
const {
  getPrep,
  parsePrepData,
  getBonderList,
  getPrepFromNB,
  parsePrepFromNB,
  getPrepLogoUrl
} = nodeButlerLib;

const { parseBonderFormInputs, parsePrepFormInputs, samples } = utils;
const { details: CODE, setPrep: SETPREP, details2: DETAILSJSON } = samples;

export default function OverviewSection({ localData, userIsPrep, children }) {
  const [prepLogo, setPrepLogo] = useState(null);
  const [overviewState, setOverviewState] = useState(null);
  const [prepDetailsState, setPrepDetailsState] = useState(null);
  const [bondedInfoState, setBondedInfoState] = useState(null);
  const [bonderForm, setBonderForm] = useState({
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
  });
  const [prepDetailsForm, setPrepDetailsForm] = useState({
    name: "",
    email: "",
    country: "",
    city: "",
    website: "",
    details: "",
    nodeAddress: ""
  });

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

  function handleBonderFormSubmit() {
    parseBonderFormInputs(bonderForm);
  }

  function handlePrepFormInputChange(evnt) {
    const value = evnt.target.value;
    setPrepDetailsForm(prepFormState => {
      let newState = { ...prepFormState };
      newState[evnt.target.name] = value;

      return newState;
    });
  }

  function handlePrepFormSubmit() {
    parsePrepFormInputs(prepDetailsForm);
  }

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
      const prepDetails = await getPrepFromNB(loggedPrep);
      const parsedPrepDetails = parsePrepFromNB(prepDetails);

      // get prep logo data
      const prepLogoUrl = getPrepLogoUrl(parsedPrepDetails);
      setPrepLogo(prepLogoUrl);

      // update states
      setOverviewState(parsedPrepData);
      setBondedInfoState(parsedBonderList);
    }

    runAsync();
  }, []);

  return userIsPrep === true ? (
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
            <p>irepUpdateBlockHeight: {overviewState.irepUpdateBlockHeight}</p>
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
          details of the transaction will be shown in the wallet popup window
          before approving the transaction.
        </p>
        <p>Current wallets boding for your node:</p>
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
            <table className={styles.tableSetPrep}>
              <thead>
                <tr>
                  {[
                    "Bonder 1:",
                    "Bonder 2:",
                    "Bonder 3:",
                    "Bonder 4:",
                    "Bonder 5:",
                    "Bonder 6:",
                    "Bonder 7:",
                    "Bonder 8:",
                    "Bonder 9:",
                    "Bonder 10:"
                  ].map((label, index) => {
                    return <th key={`bonder-header-${index}`}>{label}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    ["bonder1", bonderForm.bonder1],
                    ["bonder2", bonderForm.bonder2],
                    ["bonder3", bonderForm.bonder3],
                    ["bonder4", bonderForm.bonder4],
                    ["bonder5", bonderForm.bonder5],
                    ["bonder6", bonderForm.bonder6],
                    ["bonder7", bonderForm.bonder7],
                    ["bonder8", bonderForm.bonder8],
                    ["bonder9", bonderForm.bonder9],
                    ["bonder10", bonderForm.bonder10]
                  ].map((arrItem, index) => {
                    return (
                      <td key={`bonder-item-${index}`}>
                        <input
                          type="text"
                          name={arrItem[0]}
                          value={arrItem[1]}
                          onChange={handleFormInputChange}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
            <button className={styles.button} onClick={handleBonderFormSubmit}>
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
          is a file that you can defined in your Prep on-chain data, it will be
          used by third parties to fetch information about your node. Use the
          following format and put the file in a route accesible on the internet
          (you can host it on your team website, github, etc) and then update
          your Prep settings with a link to it.
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
          Use the following form to update your Prep data, a transaction will be
          signed with your node address using your preferred wallet, you can see
          the details of the transaction before submitting it in the wallet
          popup window.
        </p>
        <div className={styles.setPrepForm}>
          <div
            style={{
              display: "flex",
              flexFlow: "column nowrap",
              alignSelf: "center"
            }}
          >
            <table className={styles.tableSetPrep}>
              <thead>
                <tr>
                  {[
                    "Name:",
                    "Email:",
                    "Country:",
                    "City:",
                    "Website:",
                    "Details:",
                    "nodeAddress:"
                  ].map((label, index) => {
                    return <th key={`prep-header-${index}`}>{label}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[
                    ["name", prepDetailsForm.name],
                    ["email", prepDetailsForm.email],
                    ["country", prepDetailsForm.country],
                    ["city", prepDetailsForm.city],
                    ["website", prepDetailsForm.website],
                    ["details", prepDetailsForm.details],
                    ["nodeAddress", prepDetailsForm.nodeAddress]
                  ].map((arrItem, index) => {
                    return (
                      <td key={`prep-item-${index}`}>
                        <input
                          type="text"
                          name={arrItem[0]}
                          value={arrItem[1]}
                          onChange={handlePrepFormInputChange}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
            <button className={styles.button} onClick={handlePrepFormSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    children
  );
}
