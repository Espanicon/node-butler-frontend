import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Link from "next/link";
import AppLayout, { siteTitle } from "../components/appLayout.js";
import { LoginModal, utils as loginUtils } from "../components/LoginModal";
import AppSection from "../components/appSection";
import OverviewSection from "../components/overviewSection";
import CPSProposalsSection from "../components/cpsProposalsSection";
import NetworkProposalsSection from "../components/networkProposalsSection";
import ContractExplorerSection from "../components/contractExplorerSection";
import NodeButlerSDK from "../utils/customLib";
import utils from "../utils/utils";
import styles from "../styles/app.module.css";

// MOCK DATA
//
const MOCK_DATA = {
  auth: {
    selectedWallet: "hx9fa9d224306b0722099d30471b3c2306421aead7", //mainnet
    methodUsed: "ICONEX",
    bip44Path: null,
    successfulLogin: true
  }
};

// constants
const nodeButlerLib = new NodeButlerSDK();
const { getPreps } = nodeButlerLib;
const { getAllPrepsAddresses } = utils;
// Functions
//
function getSections() {
  return [
    { label: "Overview", code: "_OVERVIEW_", id: uuidv4() },
    { label: "CPS Proposals", code: "_CPS_", id: uuidv4() },
    { label: "Network Proposals", code: "_NETWORK_", id: uuidv4() },
    { label: "Contract Explorer", code: "_CONTRACT_", id: uuidv4() }
  ];
}

// Constants
//
const LOCAL_KEY = "NB-1a96894a-afb9-4050-899b-71e63d5261f2";
const INIT_LOGIN = loginUtils.getInitLocalData();
const SECTIONS = getSections();
const INIT_SECTION = SECTIONS[0];

// Main react component
export default function App() {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [localData, setLocalData] = useState(INIT_LOGIN);
  const [activeSection, setActiveSection] = useState(INIT_SECTION);
  const [allPreps, setAllPreps] = useState(null);
  const [userIsAPrep, setUserIsAPrep] = useState(null);
  /*
   * localData: {
   * selectedWallet: 'hx3e202..',
   * methodUsed: 'ICONEX' | 'LEDGER',
   * successfulLogin: bool
   */
  function toggleLogin() {
    // toggles between login and logout
    if (localData.auth.successfulLogin) {
      handleLogout();
    } else {
      handleLogin();
    }
  }

  function handleLogin() {
    // login with ICON
    setLoginModalIsOpen(true);
  }

  function handleLogout() {
    // close user session
    handleLocalDataChange(loginUtils.getInitLocalData());
  }

  function handleLocalDataChange(newLocalData) {
    //
    setLocalData(newLocalData);

    // write login data locally to make user session persistance
    loginUtils.saveDataToLocal(newLocalData, LOCAL_KEY);
  }

  function closeLoginModal() {
    // this function handles the closing of the LoginModal
    // dataFromModal is the login data passed from the component
    // to the parent after the login process
    setLoginModalIsOpen(false);
  }

  function getDataFromLoginModal(loginData) {
    // Callback function that gets called from within LoginModal
    // to pass login data into parent
    let newLocalData = {
      // auth: MOCK_DATA.auth // TODO: FOR TESTING
      auth: loginData
    };
    // newLocalData.auth.selectedWallet =
    //   "hx38f35eff5e5516b48a713fe3c8031c94124191f0"; //berlin

    handleLocalDataChange(newLocalData);
  }

  function handleActiveSectionChange(newActiveSection) {
    setActiveSection(newActiveSection);
  }

  useEffect(() => {
    if (localData.auth.successfulLogin === false || allPreps == null) {
      //
    } else {
      //
      if (allPreps.includes(localData.auth.selectedWallet)) {
        // if the wallet used for login is a prep
        setUserIsAPrep(true);
      } else {
        // if is not a prep
        setUserIsAPrep(false);
      }
    }
  }, [localData, allPreps]);

  useEffect(() => {
    async function initialFetch() {
      const prepsRaw = await getPreps();
      const prepsParsed = getAllPrepsAddresses(prepsRaw.preps);
      setAllPreps(prepsParsed);
    }

    // run initial async data fetch for al preps
    initialFetch();

    // get local login data on first render
    const userLocalData = loginUtils.getLocalData(LOCAL_KEY);

    // set loginData state
    handleLocalDataChange(userLocalData);
  }, []);

  return (
    <AppLayout
      localData={localData}
      onLogout={handleLogout}
      onLogin={handleLogin}
      disableLogin={allPreps === null ? true : false}
    >
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.main}>
        <div className={styles.sidebar}>
          {SECTIONS.map(eachSection => {
            return (
              <div
                className={`${styles.sidebarSection} ${
                  activeSection.code === eachSection.code
                    ? styles.sidebarActiveSection
                    : ""
                }`}
                key={eachSection.id}
                onClick={() => handleActiveSectionChange(eachSection)}
              >
                {eachSection.label}
              </div>
            );
          })}
        </div>
        <div className={styles.mainSection}>
          {allPreps == null ? (
            <CustomMessage msg="Fetching Prep Data wait a few seconds before login" />
          ) : localData.auth.successfulLogin === false ||
            userIsAPrep == null ? (
            <CustomMessage msg="Please login" />
          ) : (
            (() => {
              switch (activeSection.code) {
                case SECTIONS[0].code:
                  return (
                    <OverviewSection
                      // localData={MOCK_DATA}
                      localData={localData}
                      userIsPrep={userIsAPrep}
                    >
                      <CustomMessage msg="User is not a Prep" />
                    </OverviewSection>
                  );
                case SECTIONS[1].code:
                  return (
                    <CPSProposalsSection
                      localData={MOCK_DATA}
                      // localData={localData}
                      userIsPrep={userIsAPrep}
                    >
                      <CustomMessage msg="User is not a Prep" />
                    </CPSProposalsSection>
                  );
                case SECTIONS[2].code:
                  return (
                    <NetworkProposalsSection
                      // localData={MOCK_DATA}
                      localData={localData}
                      userIsPrep={userIsAPrep}
                    >
                      <CustomMessage msg="User is not a Prep" />
                    </NetworkProposalsSection>
                  );
                case SECTIONS[3].code:
                  return (
                    <ContractExplorerSection
                      // localData={MOCK_DATA}
                      localData={localData}
                      userIsPrep={userIsAPrep}
                    >
                      <CustomMessage msg="User is not a Prep" />
                    </ContractExplorerSection>
                  );
                default:
                  return <div>404 Unexpected Error</div>;
              }
            })()
          )}
        </div>
        <LoginModal
          isOpen={loginModalIsOpen}
          onRequestClose={closeLoginModal}
          onRetrieveData={getDataFromLoginModal}
        />
      </div>
    </AppLayout>
  );
}

function CustomMessage({ msg }) {
  return (
    <div className={styles.logoContainer}>
      <h1>{msg}</h1>
      <img
        src="/images/icon-logo.png"
        className={styles.iconLogo}
        alt="icon logo"
      />
    </div>
  );
}
// (() => {
//   switch (activeSection.code) {
//     default:
//       return <div>404 unexpected Error</div>;
//   }
// })()
