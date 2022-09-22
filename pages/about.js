import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout.js";
import { SectionWithLogo, Section } from "../components/styledSections.js";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/about.module.css";

export default function About() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.container}>
        <Section>
          <SectionWithLogo path="/images/espanicon-logo.png">
            <h1>About Node Butler</h1>
            <p>
              <b>Node Butler</b> is a web app intended to facilitate the
              management of validator nodes in the ICON Network. It allows node
              managers to easily execute common task like editing on chain node
              data (node name, email, country, etc), managing wallets for
              bonding, voting on network proposals, signing transactions on any
              SCORE (smart contract) in the ICON Network, etc.
            </p>
            <p>The app is divided in the following sections:</p>
            <ul>
              <li>
                <b>Overview Section:</b> This section shows general on-chain
                data related to the node and allows for this data to be modified
                by signing a transaction for the <b>SetPRep</b> method with the
                node wallet using either ICONex or Hana. In this section you
                will also be able to add/delete wallets that are able to bond
                for your node by signing a transaction on the{" "}
                <b>SetBonderlist</b> method.
              </li>
              <li>
                <b>CPS Proposals:</b> This section shows a summary of all the
                proposals that have been submitted to ICON decentralized funding
                program (<b>Contribution Proposal System</b>). It displays the
                state of the proposal as well as the votes of each Prep.
              </li>
              <li>
                <b>Network Proposals:</b> This sections shows a summary of all
                the network proposals in the ICON Network and allows the Preps
                to vote to approve or reject network proposals that are
                currently active.
              </li>
              <li>
                <b>Contract Explorer:</b> This section allows anyone to sign
                transactions on any SCORE (Smart Contract) in the ICON Network
                with the addresses that are currently available in your Hana or
                ICONex wallet.
              </li>
            </ul>
          </SectionWithLogo>
        </Section>
      </div>
    </Layout>
  );
}
