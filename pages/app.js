import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import AppLayout, { siteTitle } from "../components/appLayout.js";
import LoginModal from "../components/LoginModal/LoginModal";
import styles from "../styles/app.module.css";

function getInitLoginData() {
  return {
    selectedWallet: null,
    methodUsed: null,
    successfulLogin: false
  };
}

export default function App() {
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [loginData, setLoginData] = useState(getInitLoginData());
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
    setLoginData(getInitLoginData());
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
        <div className={styles.logoContainer}>
          <Image
            src="/images/icon-logo.png"
            width={100}
            height={100}
            className={styles.iconLogo}
            alt="icon logo"
          />
        </div>
        <h2>Login with ICON</h2>
        <button className={styles.loginButton} onClick={handleLogin}>
          <p>Log in</p>
        </button>
        <LoginModal
          isOpen={loginModalIsOpen}
          onRequestClose={closeLoginModal}
          onRetrieveData={getDataFromLoginModal}
        />
        <p>Login data: {JSON.stringify(loginData)}</p>
      </div>
    </AppLayout>
  );
}
