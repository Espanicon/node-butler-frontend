import { useState, useEffect } from "react";
import styles from "../styles/overviewSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import utils from "../utils/utils";

const nodeButlerLib = new NodeButlerSDK("api.espanicon.team");
const {
  getPrep,
  parsePrepData,
  getBonderList,
  getPrepFromNB,
  parsePrepFromNB,
  getPrepLogoUrl
} = nodeButlerLib;

const CODE = utils.samples.details;
const SETPREP = utils.samples.setPrep;
const DETAILSJSON = utils.samples.details2;

export default function OverviewSection({ localData }) {
  const [prepLogo, setPrepLogo] = useState(null);
  const [overviewState, setOverviewState] = useState(null);
  const [prepDetailsState, setPrepDetailsState] = useState(null);
  const [bondedInfoState, setBondedInfoState] = useState(null);

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
      console.log("parsed details");
      console.log(parsedPrepDetails);

      // get prep logo data
      const prepLogoUrl = getPrepLogoUrl(parsedPrepDetails);
      console.log("prep logo url");
      console.log(prepLogoUrl);

      // update states
      setOverviewState(parsedPrepData);
      setBondedInfoState(parsedBonderList);
    }

    runAsync();
  }, []);

  return (
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
            <img src={prepLogo === null ? "/images/icon-logo.png" : ""} />
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
                  <th>Bonder 1:</th>
                  <th>Bonder 2:</th>
                  <th>Bonder 3:</th>
                  <th>Bonder 4:</th>
                  <th>Bonder 5:</th>
                  <th>Bonder 6:</th>
                  <th>Bonder 7:</th>
                  <th>Bonder 8:</th>
                  <th>Bonder 9:</th>
                  <th>Bonder 10:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
            <button className={styles.button}>Submit</button>
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
                  <th>Name:</th>
                  <th>Email:</th>
                  <th>Country:</th>
                  <th>City:</th>
                  <th>Website:</th>
                  <th>Details:</th>
                  <th>nodeAddress:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                  <td>
                    <input type="text" />
                  </td>
                </tr>
              </tbody>
              <tfoot></tfoot>
            </table>
            <button className={styles.button}>Submit</button>
          </div>
        </div>
        <Hr />
      </div>
    </div>
  );
}
