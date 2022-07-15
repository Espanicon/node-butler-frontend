import { useState } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
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
const CODE = `{
  representative: {
    logo:{
    logo_256: "http://somesite.com/logo-small.jpg",
    logo_1024: "http://somesite.com/logo-big.jpg",
    logo_svg: "http://somesite.com/logo.svg"
  },
  media: {
    steemit: "",
    twitter: "",
    youtube: "",
    facebook: "",
    github: "",
    reddit: "",
    keybase: "",
    telegram: "",
    wechat: ""
  }
}`;

const SETPREP = `{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "icx_sendTransaction",
    "params": {
        "value": "0x6c6b935b8bbd400000",
        "data": {
            "method": "registerPRep",
            "params": {
                "name": "ABC Node",
                "country": "KOR",
                "city": "Seoul",
                "email": "abc@example.com",
                "website": "https://abc.example.com/",
                "details": "https://abc.example.com/details/",
                "p2pEndpoint": "abc.example.com:7100",
                "nodeAddress": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb"
            }
        },
    }
}`;
const DETAILSJSON = {
  representative: {
    logo: {
      logo_256: "http://somesite.com/logo-small.jpg",
      logo_1024: "http://somesite.com/logo-big.jpg",
      logo_svg: "http://somesite.com/logo.svg"
    },
    media: {
      steemit: "",
      twitter: "",
      youtube: "",
      facebook: "",
      github: "",
      reddit: "",
      keybase: "",
      telegram: "",
      wechat: ""
    }
  },
  server: {
    location: {
      country: "USA",
      city: "Houston"
    },
    server_type: "cloud",
    api_endpoint: "127.0.0.1:9000"
  }
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
      <div className={styles.defaultSection}>
        <h2>Bonded Info:</h2>
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
          <pre className={styles.codeBlockPre}>
            {/* <code className={styles.codeBlock}>{SETPREP}</code> */}
            {CODE}
          </pre>
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
          <pre className={styles.codeBlockPre}>
            {/* <code className={styles.codeBlock}>{SETPREP}</code> */}
            {SETPREP}
          </pre>
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
