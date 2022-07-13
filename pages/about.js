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
            <h1>FAQ</h1>
            <p>
              <b>Node Butler</b> is a web app intented for node
              validators..."Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum."
            </p>
          </SectionWithLogo>
        </Section>
      </div>
    </Layout>
  );
}
