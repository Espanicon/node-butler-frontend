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

export default function NetworkProposalsSection({
  localData,
  userIsPrep,
  children
}) {
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
    // console.log(networkProposals);
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
      } else {
        activeProposals.push(eachProposal);
      }
    }

    console.log("all network proposals");
    console.log(allProposalsData);
    console.log(activeProposals);
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

    // run initial data fetch
    fetchInitialData();
  }, []);
  return userIsPrep === true ? (
    <div className={styles.main}>
      <h2>Active network proposals</h2>
      <div className={styles.section}>
        {activeNetworkProposals == null ? (
          <LoadingComponent />
        ) : activeNetworkProposals.length < 1 ? (
          <p>** CURRENTLY NO ACTIVE PROPOSALS TO VOTE **</p>
        ) : (
          activeNetworkProposals.map((eachProposal, index) => {
            return (
              <CustomCard2
                eachProposal={eachProposal}
                handleModalOnOpen={handleModalOnOpen}
                index={index}
                key={uuidv4()}
              />
            );
          })
        )}
      </div>
      <Hr />
      <h2>All network proposals</h2>
      {networkProposals == null ? (
        <LoadingComponent />
      ) : (
        <div className={styles.section}>
          {networkProposals.map((eachProposal, index) => {
            return (
              <CustomCard
                eachProposal={eachProposal}
                handleModalOnOpen={handleModalOnOpen}
                index={index}
                key={uuidv4()}
              />
            );
          })}
        </div>
      )}
      <CustomModal
        isOpen={isOpen}
        onClose={handleModalOnClose}
        proposals={networkProposals}
        index={proposalIndex}
      />
    </div>
  ) : (
    children
  );
}

function CustomCard2({ eachProposal, index }) {
  const [prepsVoting, setPrepsVoting] = useState(null);
  const [hasVoted, setHasVoted] = useState(null);

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
      className={`${styles.cardContainer} ${styles.cardContainer2} ${styledStatus}`}
    >
      <div className={styles.cardTitle}>
        <p>{eachProposal.contents.title}</p>
      </div>
      <div className={styles.cardStatusContainer2}>
        <p className={styles.cardStatusInfo}>
          <b>Your voting status: </b>
          Not voted
        </p>
        <p className={styles.cardStatusInfo}>
          <b>Preps to vote in this proposal: </b>
          Espanicon, Icon foundation, IAM, rhizome
        </p>
      </div>
      <div className={styles.cardStatusContainer}>
        <button className={styles.button}>Approve</button>
        <button className={styles.button}>Reject</button>
      </div>
    </div>
  );
}
function CustomCard({ eachProposal, handleModalOnOpen, index }) {
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
}

function CustomModal({ isOpen, onClose, proposals, index }) {
  return (
    <GenericModal isOpen={isOpen} onClose={onClose}>
      {proposals == false || proposals == null || index === false ? (
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
        <ModalContent proposals={proposals} index={index} />
      )}
    </GenericModal>
  );
}
function ModalContent({ proposals, index }) {
  return (
    <div className={styles.proposalContainer}>
      <div className={styles.proposalContainerHeader}>
        <h2>{proposals[index].contents.title}</h2>
        <ul>
          <li>Proposer: {proposals[index].proposerName}</li>
          <li>
            Start (block height): {parseInt(proposals[index].startBlockHeight)}
          </li>
          <li>
            End (block height): {parseInt(proposals[index].endBlockHeight)}
          </li>
          <li>Proposal id: {proposals[index].id}</li>
          <li>Status: {DATA.statusTypes[proposals[index].status]}</li>
          <li>Type: {DATA.proposalTypes[proposals[index].contents.type]}</li>
        </ul>
      </div>
      <Hr />
      <div
        className={styles.proposalContainerBody}
        dangerouslySetInnerHTML={{
          __html: proposals[index].contents.description
        }}
      ></div>
    </div>
  );
}
