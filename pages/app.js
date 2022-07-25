import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import Link from "next/link";
import AppLayout, { siteTitle } from "../components/appLayout.js";
import LoginModal from "../components/LoginModal/LoginModal";
import AppSection from "../components/appSection";
import OverviewSection from "../components/overviewSection";
import CPSProposalsSection from "../components/cpsProposalsSection";
import NetworkProposalsSection from "../components/networkProposalsSection";
import ContractExplorerSection from "../components/networkProposalsSection";
import styles from "../styles/app.module.css";

function getInitLoginData() {
  return {
    selectedWallet: null,
    methodUsed: null,
    successfulLogin: false
  };
}

function getSections() {
  return [
    { label: "Overview", code: "_OVERVIEW_", id: uuidv4() },
    { label: "CPS Proposals", code: "_CPS_", id: uuidv4() },
    { label: "Network Proposals", code: "_NETWORK_", id: uuidv4() },
    { label: "Contract Explorer", code: "_CONTRACT_", id: uuidv4() }
  ];
}

const INIT_LOGIN = getInitLoginData();
const SECTIONS = getSections();
const INIT_SECTION = SECTIONS[0];

export default function App() {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [loginData, setLoginData] = useState(INIT_LOGIN);
  const [activeSection, setActiveSection] = useState(INIT_SECTION);
  /*
   * loginData: {
   * selectedWallet: 'hx3e202..',
   * methodUsed: 'ICONEX' | 'LEDGER',
   * successfulLogin: bool
   */

  function handleLogin() {
    // login with ICON
    setLoginModalIsOpen(true);
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
    setLoginData(loginData);
  }

  function handleLogout() {
    //
    setLoginData(INIT_LOGIN);
  }

  function handleActiveSectionChange(newActiveSection) {
    setActiveSection(newActiveSection);
  }

  return (
    <AppLayout
      loginData={loginData}
      onLogout={handleLogout}
      onLogin={handleLogin}
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
          {loginData.successfulLogin ? (
            (() => {
              switch (activeSection.code) {
                case SECTIONS[0].code:
                  return <OverviewSection activeSection={activeSection} />;
                case SECTIONS[1].code:
                  return <CPSProposalsSection activeSection={activeSection} />;
                case SECTIONS[2].code:
                  return (
                    <NetworkProposalsSection activeSection={activeSection} />
                  );
                case SECTIONS[3].code:
                  return (
                    <ContractExplorerSection activeSection={activeSection} />
                  );
                default:
                  return <div>404 Unexpected Error</div>;
              }
            })()
          ) : (
            <div className={styles.logoContainer}>
              <h1>Please login</h1>
              <img
                src="/images/icon-logo.png"
                className={styles.iconLogo}
                alt="icon logo"
              />
            </div>
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

// (() => {
//   switch (activeSection.code) {
//     default:
//       return <div>404 unexpected Error</div>;
//   }
// })()
