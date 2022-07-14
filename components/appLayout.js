import { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/appLayout.module.css";
import utilStyles from "../styles/utils.module.css";
import ContactItems from "./contactItems.js";

export const siteTitle = "Node Butler - made by Espanicon.team";
const height = 40;
const width = height / 1.0184331797;

function SectionBreak() {
  return (
    <div className={styles.breakContainer}>
      <div className={`${styles.breakSection} ${styles.breakOne}`}></div>
      <div className={`${styles.breakSection} ${styles.breakTwo}`}></div>
      <div className={`${styles.breakSection} ${styles.breakThree}`}></div>
    </div>
  );
}

function Breakline() {
  return <div className={styles.breakline}></div>;
}

export default function AppLayout({ loginData, onLogout, onLogin, children }) {
  let checkboxRef = useRef();

  function handleLogin() {
    closeHamburguerMenu();
    onLogin();
  }

  function handleLogout() {
    closeHamburguerMenu();
    onLogout();
  }

  function closeHamburguerMenu() {
    checkboxRef.current.checked = false;
  }
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Espanicon.team Prep official website"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link href="/">
            <div className={styles.headerInnerContainerLeft}>
              <div
                style={{
                  display: "block",
                  minWidth: "40px",
                  margin: "5px 10px"
                }}
              >
                <Image
                  priority
                  className={styles.logo}
                  src="/images/espanicon-logo.png"
                  height={height}
                  width={width}
                  alt="espanicon"
                  // layout="responsive"
                />
              </div>
              <div className={styles.headerLogoTitle}>
                <h1>Node Butler</h1>
              </div>
            </div>
          </Link>
          <div className={styles.headerInnerContainerRight}>
            <div className={styles.hamburguerMenu}>
              <input
                id="menu-toggle"
                className={styles.menuToggle}
                type="checkbox"
                ref={checkboxRef}
              />
              <label
                className={styles.menuButtonContainer}
                htmlFor="menu-toggle"
              >
                <div className={styles.menuButton}></div>
              </label>
              <div className={styles.loginMenu}>
                <div className={styles.tooltipArrow}></div>
                <div className={styles.tooltip}>
                  {loginData.successfulLogin ? (
                    <div className={styles.tooltipContainer}>
                      <p>
                        Logged in as:{" "}
                        {loginData.selectedWallet.slice(0, 10) + "..."}
                      </p>
                      <Breakline />
                      <p
                        className={styles.tooltipElement}
                        onClick={handleLogout}
                      >
                        Sign out
                      </p>
                    </div>
                  ) : (
                    <div className={styles.tooltipContainer}>
                      <p
                        className={styles.tooltipElement}
                        onClick={handleLogin}
                      >
                        Login with ICON
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionBreak />
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <p>Visit Espanicon @</p>
        <ContactItems />
      </footer>
    </div>
  );
}

// <div className={styles.headerSection}>
//   <div className={styles.logoContainer}>
//       <div className={styles.logoContainerInner}>
//       </div>
//     </Link>
//   </div>
// </div>
