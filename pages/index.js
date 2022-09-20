import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout.js";
import { SectionWithLogo, Section } from "../components/styledSections.js";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/index.module.css";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Section>
        <SectionWithLogo path="/images/icon-logo.png">
          <div className={styles.container}>
            <h2 className={styles.title}>
              Node-Butler makes managing ICON nodes easier!
            </h2>
            <p>
              <b>Node-Butler</b> is a web-based blockchain application with the
              goal of making it easier to manage validator nodes in{" "}
              <b>ICON Network</b>.
            </p>
            <p>
              This project is able to exists thanks to a fund granted by the{" "}
              <b>Contribution Proposal System</b> a decentralized funding
              program that exists as a core component of the ICON Network, if
              you want to create cool projects in ICON and are looking for
              funding we recommend you give a look to the CPS in the following{" "}
              <a href="https://cps.icon.community/" target="_blank">
                link!
              </a>
            </p>
            <p>
              If you like <b>Node-Butler</b> and want to support our work you
              can do it by simply allocating votes to the <b>Espanicon</b> node
              with your staked <b>ICX</b>, every vote counts!, we highly
              appreciate your support!.
            </p>
          </div>
        </SectionWithLogo>
        <Link href="/app">
          <div className={styles.appLink}>
            <b>Go to Node-Butler app</b>
          </div>
        </Link>{" "}
      </Section>
    </Layout>
  );
}
