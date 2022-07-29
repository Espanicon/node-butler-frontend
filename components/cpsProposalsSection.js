import { useState, useEffect } from "react";
import styles from "../styles/cpsProposalsSection.module.css";
import { Hr } from "./customComponents";
import { lib } from "../utils/espanicon-sdk/lib-no-sdk";
import { v4 as uuidv4 } from "uuid";
const { getCPSProposalsFromNB } = lib;

export default function CPSProposalsSection({ activeSection }) {
  const [CPSProposals, setCPSProposals] = useState(null);

  function handleCPSProposals(cpsData) {
    // validates and set the cps proposals state
    setCPSProposals(cpsData);
  }

  useEffect(() => {
    async function asyncFetch() {
      const cpsData = await getCPSProposalsFromNB();
      handleCPSProposals(cpsData);
    }

    // fetch CPS Proposal data from node-butler backend
    asyncFetch();
  }, []);
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
        </p>
      </div>
      <div className={styles.body}>
        {CPSProposals == null ? (
          <div className={styles.imgLoading}>
            {[1, 2, 3, 4, 5].map(foo => (
              <div className={styles.imgLoadingItem} key={uuidv4()}></div>
            ))}
          </div>
        ) : (
          CPSProposals.map(eachProposals => {
            let styledStatus;
            let imgSrc;

            switch (eachProposals.status) {
              case "_active":
              case "_completed":
                styledStatus = styles.greenBorder;
                imgSrc = "/images/check-logo.svg";
                break;
              case "_disqualified":
                styledStatus = styles.redBorder;
                imgSrc = "/images/cancel-logo-2.svg";
                break;
              default:
                styledStatus = styles.yellowBorder;
                imgSrc = "/images/pending-logo.svg";
            }
            return (
              <div
                className={`${styles.proposalContainer} ${styledStatus}`}
                key={uuidv4()}
              >
                <div className={styles.proposalTitle}>
                  <p>{eachProposals.project_title}</p>
                </div>
                <Hr />
                <div className={styles.proposalContent}>
                  <div className={styles.proposalInfo}>
                    <p>
                      Budget: {eachProposals.total_budget} {eachProposals.token}
                    </p>
                    <p>Date: {eachProposals.timestamp.split("T")[0]}</p>
                    <p>Sponsor: {eachProposals.sponsor_address}</p>
                  </div>
                  <div className={`${styles.proposalStatus}`}>
                    <img
                      src={imgSrc}
                      className={styles.proposalImage}
                      alt="proposal status"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
