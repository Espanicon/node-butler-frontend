import { useState, useEffect } from "react";
import styles from "../styles/cpsProposalsSection.module.css";
import { Hr } from "./customComponents";
import { lib } from "../utils/espanicon-sdk/lib-no-sdk";
import { v4 as uuidv4 } from "uuid";
import GenericModal from "./genericModal";
const { getCPSProposalsFromNB } = lib;

export default function CPSProposalsSection({ activeSection }) {
  const [CPSProposals, setCPSProposals] = useState(null);
  const [proposalInfo, setProposalInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleCPSProposals(cpsData) {
    // validates and set the cps proposals state
    setCPSProposals(cpsData);
  }

  function handleModalOnClose() {
    setIsOpen(false);
  }

  function handleModalOnOpen(index) {
    // fetch proposal summary

    // set proposal summary and comments in the proposalInfo state

    // open modal
    setIsOpen(true);
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
          Here you can see a list of all CPS Proposals, each proposal can have
          one of the following <i>status</i>:
          <ul>
            <li>
              <b>Active:</b> Proposal has been approved and is currently
              ongoing.
            </li>
            <li>
              <b>Completed:</b> Proposal was approved during voting period and
              was completed successfully.
            </li>
            <li>
              <b>Disqualified:</b> Proposal wasnt approved during voting period.
            </li>
            <li>
              <b>Paused:</b> Proposal has been paused.
            </li>
            <li>
              <b>Pending:</b> Proposal currently in voting period.
            </li>
          </ul>
        </p>
      </div>
      <Hr />
      <div className={styles.body}>
        {CPSProposals == null ? (
          <div className={styles.imgLoading}>
            {[1, 2, 3, 4, 5].map(foo => (
              <div className={styles.imgLoadingItem} key={uuidv4()}></div>
            ))}
          </div>
        ) : (
          CPSProposals.map((eachProposals, index) => {
            let statusTitle;
            let imgSrc;
            let styledStatus;

            switch (eachProposals.status) {
              case "_active":
                statusTitle = "Active";
                imgSrc = "/images/check-logo.svg";
                styledStatus = styles.greenBorder;
                break;
              case "_completed":
                statusTitle = "Completed";
                imgSrc = "/images/check-logo.svg";
                styledStatus = styles.greenBorder;
                break;
              case "_disqualified":
                statusTitle = "Disqualified";
                imgSrc = "/images/cancel-logo-2.svg";
                styledStatus = styles.redBorder;
                break;
              case "_paused":
                statusTitle = "Paused";
                imgSrc = "/images/pending-logo.svg";
                styledStatus = styles.yellowBorder;
                break;
              case "_pending":
                statusTitle = "Pending";
                styledStatus = styles.yellowBorder;
                imgSrc = "/images/pending-logo.svg";
                break;
              default:
                statusTitle = "Unknown";
                styledStatus = styles.yellowBorder;
                imgSrc = "/images/pending-logo.svg";
            }
            return (
              <div
                className={`${styles.cardContainer} ${styledStatus}`}
                key={uuidv4()}
                onClick={() => handleModalOnOpen(index)}
              >
                <div className={styles.cardTitle}>
                  <p>{eachProposals.project_title}</p>
                </div>
                <div className={`${styles.cardStatusContainer}`}>
                  <p className={styles.cardStatusInfo}>
                    <b>Status:</b> {statusTitle}
                  </p>
                  <img
                    src={imgSrc}
                    className={styles.cardStatusImage}
                    alt="proposal status"
                  />
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardInfoItem}>
                    <img
                      src="/images/calendar.svg"
                      className={styles.cardTinyImage}
                      alt="proposal status"
                    />
                    <p>
                      <b>Date:</b> {eachProposals.timestamp.split("T")[0]}
                    </p>
                  </div>
                  <div className={styles.cardInfoItem}>
                    <img
                      src="/images/budget.svg"
                      className={styles.cardTinyImage}
                      alt="proposal status"
                    />
                    <p>
                      <b>Budget:</b> {eachProposals.total_budget}{" "}
                      {eachProposals.token}
                    </p>
                  </div>
                  <div className={styles.cardInfoItem}>
                    <img
                      src="/images/sponsor.svg"
                      className={styles.cardTinyImage}
                      alt="proposal status"
                    />
                    <p>
                      <b>Sponsor:</b> {eachProposals.sponsor_address}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <GenericModal isOpen={isOpen} onClose={handleModalOnClose}>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
        <p>
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum."
        </p>
      </GenericModal>
    </div>
  );
}
