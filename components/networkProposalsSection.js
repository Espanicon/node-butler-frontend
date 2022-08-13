import { useState, useEffect } from "react";
import styles from "../styles/networkProposalsSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import GenericModal from "./genericModal";

const nodeButlerLib = new NodeButlerSDK();
const { getAllNetworkProposals } = nodeButlerLib;

const DATA = {
  statusTypes: {
    "0x0": "VOTING",
    "0x1": "APPLIED",
    "0x2": "DISAPPROVED",
    "0x3": "CANCELED",
    "0x4": "APPROVED",
    "0x5": "EXPIRED"
  },
  imgSrc: {
    "0x0": "/images/pending-logo.svg",
    "0x1": "/images/check-logo.svg",
    "0x2": "/images/cancel-logo-2.svg",
    "0x3": "/images/cancel-logo-2.svg",
    "0x4": "/images/check-logo.svg",
    "0x5": "/images/cancel-logo-2.svg"
  },
  styledStatus: {
    "0x0": styles.yellowBorder,
    "0x1": styles.greenBorder,
    "0x2": styles.redBorder,
    "0x3": styles.redBorder,
    "0x4": styles.greenBorder,
    "0x5": styles.redBorder
  },
  proposalTypes: {
    "0x0": "TEXT",
    "0x1": "REVISION",
    "0x2": "MALICIOUS_SCORE",
    "0x3": "PREP_DISQUALIFICATION",
    "0x4": "STEP_PRICE",
    "0x5": "IREP",
    "0x6": "STEP_COSTS",
    "0x7": "REWARD_FUND",
    "0x8": "REWARD_FUNDS_ALLOCATION",
    "0x9": "NETWORK_PROPOSAL"
  }
};

export default function NetworkProposalsSection({ localData }) {
  const [networkProposals, setNetworkProposals] = useState(null);
  const [activeNetworkProposals, setActiveNetworkProposals] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(false);

  function handleModalOnClose() {
    setIsOpen(false);
    setProposalInfo(false);
    setProposalIndex(false);
  }

  function handleModalOnOpen(index) {
    setProposalIndex(index);
    console.log(networkProposals);
    setIsOpen(true);
  }

  function handleNetworkProposals(proposalData) {
    // validates and sets network proposal state
    setNetworkProposals(proposalData);
  }

  function searchForActiveNetworkProposals(allProposalsData) {
    let activeProposals = [];

    for (let eachProposal of allProposalsData) {
      if (eachProposal.status === "0x0") {
        activeProposals.push(eachProposal);
      }
    }

    setActiveNetworkProposals(activeProposals);
  }

  useEffect(() => {
    async function fetchInitialData() {
      //
      // const allNetworkProposals = await getAllNetworkProposalsFromNB();
      const allNetworkProposals = await getAllNetworkProposals();
      handleNetworkProposals(allNetworkProposals);

      searchForActiveNetworkProposals(allNetworkProposals);
    }

    // run intiial data fetch
    fetchInitialData();
  }, []);
  return (
    <div className={styles.main}>
      <h2>Active network proposals</h2>
      {activeNetworkProposals == null ? (
        <LoadingComponent />
      ) : activeNetworkProposals.length < 1 ? (
        <p>** CURRENTLY NO ACTIVE PROPOSALS TO VOTE **</p>
      ) : (
        <p>** ACTIVE PROPOSALS TO VOTE **</p>
      )}
      <Hr />
      <h2>All network proposals</h2>
      {networkProposals == null ? (
        <LoadingComponent />
      ) : (
        <div className={styles.section}>
          {networkProposals.map((eachProposal, index) => {
            let statusTitle =
              DATA.statusTypes[eachProposal.status] == null
                ? "UNKNOWN"
                : DATA.statusTypes[eachProposal.status];
            let proposalType =
              DATA.proposalTypes[eachProposal.contents.type] == null
                ? "UNKNOWN"
                : DATA.proposalTypes[eachProposal.contents.type];
            let styledStatus =
              DATA.styledStatus[eachProposal.status] == null
                ? styles.yellowBorder
                : DATA.styledStatus[eachProposal.status];
            let imgSrc =
              DATA.imgSrc[eachProposal.status] == null
                ? DATA.imgSrc["0x0"]
                : DATA.imgSrc[eachProposal.status];

            return (
              <div
                className={`${styles.cardContainer} ${styledStatus}`}
                key={uuidv4()}
                onClick={() => handleModalOnOpen(index)}
              >
                <div className={styles.cardTitle}>
                  <p>{eachProposal.contents.title}</p>
                </div>
                <div className={styles.cardStatusContainer}>
                  <p className={styles.cardStatusInfo}>
                    <b>Status: </b>
                    {statusTitle}
                  </p>
                  <img
                    src={imgSrc}
                    className={styles.cardStatusImage}
                    alt="proposal status"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <GenericModal isOpen={isOpen} onClose={handleModalOnClose}>
        {networkProposals == false ||
        networkProposals == null ||
        proposalIndex === false ? (
          <div
            className={`${styles.proposalInfoContainer} ${styles.proposalInfoContainerIsWaiting}`}
          >
            <div className={styles.imgLoading}>
              {[1, 2, 3, 4, 5].map(foo => (
                <div className={styles.imgLoadingItem} key={uuidv4()}></div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.proposalContainer}>
            <div className={styles.proposalContainerHeader}>
              <h2>{networkProposals[proposalIndex].contents.title}</h2>
              <ul>
                <li>
                  Proposer: {networkProposals[proposalIndex].proposerName}
                </li>
                <li>
                  Start (block height):{" "}
                  {parseInt(networkProposals[proposalIndex].startBlockHeight)}
                </li>
                <li>
                  End (block height):{" "}
                  {parseInt(networkProposals[proposalIndex].endBlockHeight)}
                </li>
                <li>Proposal id: {networkProposals[proposalIndex].id}</li>
                <li>
                  Status:{" "}
                  {DATA.statusTypes[networkProposals[proposalIndex].status]}
                </li>
                <li>
                  Type:{" "}
                  {
                    DATA.proposalTypes[
                      networkProposals[proposalIndex].contents.type
                    ]
                  }
                </li>
              </ul>
            </div>
            <Hr />
            <div
              className={styles.proposalContainerBody}
              dangerouslySetInnerHTML={{
                __html: networkProposals[proposalIndex].contents.description
              }}
            ></div>
          </div>
        )}
      </GenericModal>
    </div>
  );
}
