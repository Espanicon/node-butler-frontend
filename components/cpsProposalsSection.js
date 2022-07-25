import { useState } from "react";
import styles from "../styles/cpsProposalsSection.module.css";
import { Hr } from "./customComponents";

export default function CPSProposalsSection({ activeSection }) {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <h2>CPS Proposals</h2>
        <p>
          CPS Proposals paragraph Sed ut perspiciatis unde omnis iste natus
          error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam
          voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
          consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
          consectetur, adipisci velit, sed quia non numquam eius modi tempora
          incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut
          enim ad minima veniam, quis nostrum exercitationem ullam corporis
          suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis
          autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
          voluptas nulla pariatur?"
        </p>
      </div>
      <div className={styles.body}>
        <div className={`${styles.proposalContainer} ${styles.greenBorder}`}>
          <div className={styles.proposalTitle}>
            <p>
              Title: this very long title, very very long title, a bit more long
            </p>
          </div>
          <Hr />
          <div className={styles.proposalContent}>
            <div className={styles.proposalInfo}>
              <p>Budget: 20.000 bnUSD</p>
              <p>Date: 02/02/2022</p>
              <p>Sponsor: wallet or prep name</p>
            </div>
            <div className={`${styles.proposalStatus}`}>
              <img
                src="/images/check-logo.svg"
                className={styles.proposalImage}
                alt="proposal status"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.proposalContainer} ${styles.redBorder}`}>
        <div className={styles.proposalTitle}>
          <p>
            Title: this very long title, very very long title, a bit more long
          </p>
        </div>
        <Hr />
        <div className={styles.proposalContent}>
          <div className={styles.proposalInfo}>
            <p>Budget: 20.000 bnUSD</p>
            <p>Date: 02/02/2022</p>
            <p>Sponsor: wallet or prep name</p>
          </div>
          <div className={`${styles.proposalStatus}`}>
            <img
              src="/images/cancel-logo-2.svg"
              className={styles.proposalImage}
              alt="proposal status"
            />
          </div>
        </div>
      </div>
      <div className={`${styles.proposalContainer} ${styles.yellowBorder}`}>
        <div className={styles.proposalTitle}>
          <p>
            Title: this very long title, very very long title, a bit more long
          </p>
        </div>
        <Hr />
        <div className={styles.proposalContent}>
          <div className={styles.proposalInfo}>
            <p>Budget: 20.000 bnUSD</p>
            <p>Date: 02/02/2022</p>
            <p>Sponsor: wallet or prep name</p>
          </div>
          <div className={`${styles.proposalStatus}`}>
            <img
              src="/images/pending-logo.svg"
              className={styles.proposalImage}
              alt="proposal status"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
