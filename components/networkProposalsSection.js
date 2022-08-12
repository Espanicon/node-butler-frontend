import { useState, useEffect } from "react";
import styles from "../styles/networkProposalsSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import GenericModal from "./genericModal";

const nodeButlerLib = new NodeButlerSDK();
const { getAllNetworkProposalsFromNB } = nodeButlerLib;

const DATA = {
  statusTypes: {
    "0x0": "VOTING_STATUS",
    "0x1": "APPLIED_STATUS",
    "0x2": "DISAPPROVED_STATUS",
    "0x3": "CANCELED_STATUS",
    "0x4": "APPROVED_STATUS",
    "0x5": "EXPIRED_STATUS"
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
  const [isOpen, setIsOpen] = useState(false);
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(false);

  function handleModalOnClose() {
    setIsOpen(false);
    setProposalInfo(false);
    setProposalIndex(false);
  }

  function handleModalOnOpen(index) {
    setIsOpen(true);
    setProposalIndex(index);
  }

  function handleNetworkProposals(proposalData) {
    // validates and sets network proposal state
    setNetworkProposals(proposalData);
  }

  useEffect(() => {
    async function fetchInitialData() {
      //
      const allNetworkProposals = await getAllNetworkProposalsFromNB();
      handleNetworkProposals(allNetworkProposals);
      // console.log(allNetworkProposals);
    }

    // run intiial data fetch
    fetchInitialData();
  }, []);
  return (
    <div className={styles.main}>
      <h2>Active network proposals</h2>
      <p>
        Network Proposals paragraph Sed ut perspiciatis unde omnis iste natus
        error sit voluptatem accusantium doloremque laudantium, totam rem
        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
        beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
        voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni
        dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
        est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
        sed quia non numquam eius modi tempora incidunt ut labore et dolore
        magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis
        nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
        aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit
        qui in ea voluptate velit esse quam nihil molestiae consequatur, vel
        illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
      </p>
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
            let imgSrc;
            let styledStatus =
              DATA.styledStatus[eachProposal.status] == null
                ? styles.yellowBorder
                : DATA.styledStatus[eachProposal.status];

            return (
              <div
                className={`${styles.cardContainer} ${styledStatus}`}
                key={uuidv4()}
                onClick={() => handleOnModal(index)}
              >
                <div className={styles.cardTitle}>
                  <p>{eachProposal.contents.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
