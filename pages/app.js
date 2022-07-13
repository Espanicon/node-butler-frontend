import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout.js";
import LoginModal from "../components/LoginModal/LoginModal";
import styles from "../styles/app.module.css";

export default function App() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.main}></div>
    </Layout>
  );
}
