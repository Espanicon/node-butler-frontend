import Head from "next/head";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout.js";
import { SectionWithLogo, Section } from "../components/styledSections.js";
import utilStyles from "../styles/utils.module.css";
import styles from "../styles/projects.module.css";

export default function Projects({ articles }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div className={styles.description}>
        <Section>
          <SectionWithLogo path="/images/espanicon-logo.png">
            <h1>Building, writing, talking and more building..</h1>
            <p>
              As part of the <b>ICON</b> community we have helped the ecosystem
              grow in many ways, from building projects of our own, to
              collaborating with other teams in development projects and
              translation projects to writing <b>ICON</b> related articles in{" "}
              <b>
                <a href="https://espanicon.medium.com/" target="_blank">
                  Medium
                </a>
              </b>{" "}
              and{" "}
              <b>
                <a href="https://dev.to/espanicon" target="_blank">
                  dev.to
                </a>
              </b>{" "}
              and actively participating in <b>ICON</b> related social sites and
              helping moderate some of the channels (
              <i>yeah is a full time job basically!</i>).
            </p>
          </SectionWithLogo>
        </Section>
      </div>
    </Layout>
  );
}
