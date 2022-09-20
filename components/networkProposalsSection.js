import { useState, useEffect, useRef } from "react";
import styles from "../styles/networkProposalsSection.module.css";
import { Hr, LoadingComponent, WalletResponseModal } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import GenericModal from "./genericModal";

const nodeButlerLib = new NodeButlerSDK();
const {
  getAllNetworkProposals,
  getNetworkProposal,
  approveNetworkProposal,
  rejectNetworkProposal,
  getParsedTxResult
} = nodeButlerLib;

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

const MAX_WAIT_PERIOD = utils.MAX_WAIT_PERIOD;
const initialTxResultState = utils.initialTxResultState;

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
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false);
  const [walletResponse, setWalletResponse] = useState(null);
  const [txResults, setTxResults] = useState(initialTxResultState);

  let txRef = useRef(null);
  let countdownRef = useRef(0);

  function handleWalletModalOnClose() {
    setWalletModalIsOpen(false);
    setWalletResponse(null);
    setTxResults(initialTxResultState);
    handleClearInterval();
  }

  function handleClearInterval() {
    try {
      countdownRef.current = 0;
      clearInterval(txRef.current);
    } catch (err) {
      console.log("error trying to clear interval");
      console.log(err);
    }
  }

  function handleModalOnClose() {
    setIsOpen(false);
    setProposalInfo(false);
    setProposalIndex(false);
  }

  function handleModalOnOpen(index) {
    setProposalIndex(index);
    setIsOpen(true);
  }

  function handleNetworkProposals(proposalData) {
    // validates and sets network proposal state
    setNetworkProposals(proposalData);
  }

  function onProposalVote(proposalId, voteIsApprove) {
    //
    if (localData.auth.successfulLogin) {
      let txData = null;

      if (voteIsApprove === true) {
        // vote to approve this proposal
        txData = approveNetworkProposal(
          proposalId,
          localData.auth.selectedWallet
        );
      } else if (voteIsApprove === false) {
        // vote to reject this proposal
        txData = rejectNetworkProposal(
          proposalId,
          localData.auth.selectedWallet
        );
      } else {
        // should never happen
      }

      // dispatch event to wallet
      if (txData == null) {
        alert("Data for transaction is invalid");
      } else {
        dispatchTxEvent(txData);
      }
    } else {
      alert("Please login first to be able to sign tx with your wallet");
    }
  }

  function dispatchTxEvent(txData) {
    window.dispatchEvent(
      new CustomEvent("ICONEX_RELAY_REQUEST", {
        detail: {
          type: "REQUEST_JSON-RPC",
          payload: txData
        }
      })
    );
    // open modal window to show result of wallet tx request
    setWalletModalIsOpen(true);
  }

  function searchForActiveNetworkProposals(allProposalsData) {
    let activeProposals = [];

    for (let eachProposal of allProposalsData) {
      if (eachProposal.status === "0x0") {
        activeProposals.push(eachProposal);
      } else {
        // activeProposals.push(eachProposal);
      }
    }

    setActiveNetworkProposals(activeProposals);
  }

  useEffect(() => {
    if (userIsPrep === true) {
      if (walletResponse == null) {
      } else {
        if (walletResponse.isError === true) {
        } else {
          txRef.current = setInterval(async () => {
            const txData = await getParsedTxResult(walletResponse.result);
            setTxResults(txData);

            countdownRef.current += 1;
          }, 1000);
        }
      }
    }

    // returns function to clear interval on component dismount
    return () => {
      if (txRef.current == null) {
      } else {
        handleClearInterval();
      }
    };
  }, [walletResponse]);

  useEffect(() => {
    if (
      txResults.txExists === true ||
      countdownRef.current >= MAX_WAIT_PERIOD
    ) {
      handleClearInterval();
    }
  }, [txResults]);

  useEffect(() => {
    function handleWalletResponse(response) {
      setWalletResponse(response);
    }

    function runWalletEventListener(evnt) {
      utils.customWalletEventListener(
        evnt,
        handleWalletResponse,
        null,
        null,
        handleWalletModalOnClose
      );
    }

    // create event listener for Hana and ICONex wallets
    window.addEventListener("ICONEX_RELAY_RESPONSE", runWalletEventListener);

    // return the following function to perform cleanup of the event
    // listener on component unmount
    return function removeCustomEventListener() {
      window.removeEventListener(
        "ICONEX_RELAY_RESPONSE",
        runWalletEventListener
      );
    };
  }, []);

  useEffect(() => {
    async function fetchInitialData() {
      //
      // const allNetworkProposals = await getAllNetworkProposalsFromNB();
      const allNetworkProposals = await getAllNetworkProposals();
      handleNetworkProposals(allNetworkProposals);

      searchForActiveNetworkProposals(allNetworkProposals);
    }

    if (userIsPrep === true) {
      // run initial data fetch
      fetchInitialData();
    }
  }, [userIsPrep]);

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
                handleProposalVote={onProposalVote}
                localData={localData}
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
      <WalletResponseModal
        isOpen={walletModalIsOpen}
        onClose={handleWalletModalOnClose}
        txData={txResults}
        walletResponse={walletResponse}
      />
    </div>
  ) : (
    children
  );
}

function CustomCard2({ eachProposal, index, handleProposalVote, localData }) {
  const [prepsVoting, setPrepsVoting] = useState(null);
  const [voteStatus, setVoteStatus] = useState(null);
  const [networkProposalData, setNetworkProposalData] = useState(null);
  const [votingIsDisable, setVotingIsDisable] = useState(true);
  const [prepCanVote, setPrepCanVote] = useState(false);

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

  function handleOnApprove() {
    //
    handleOnButtonClick(true);
  }

  function handleOnReject() {
    //
    handleOnButtonClick(false);
  }
  function handleOnButtonClick(voteIsApprove) {
    //
    handleProposalVote(eachProposal.id, voteIsApprove);
  }

  useEffect(() => {
    async function initialFetch() {
      //
      const proposalData = await getNetworkProposal(eachProposal.id);

      // test
      console.log("network proposal");
      console.log(eachProposal.id);
      console.log(proposalData);

      const votes = utils.getProposalVotes(proposalData.vote);
      setPrepsVoting(votes);

      try {
        // check how preps have voted so far on proposal
        votes.map(prepVoteArray => {
          if (prepVoteArray[0] === localData.auth.selectedWallet) {
            // if the logged prep is in the list of preps to vote
            if (prepVoteArray[1] === "0x1") {
              setVotingIsDisable(true);
              setVoteStatus(true);
            } else if (prepVoteArray[1] === "0x0") {
              setVotingIsDisable(true);
              setVoteStatus(false);
            } else {
              setVotingIsDisable(false);
              setVoteStatus(null);
            }
          } else {
          }

          // check if the logged user is validated to vote
          const loggedUserIsValidatedToVote = utils.checkIfPrepNeedToVote(
            votes,
            localData.auth.selectedWallet
          );

          setPrepCanVote(loggedUserIsValidatedToVote);
        });
      } catch (err) {
        console.log("error checking login status of user");
        console.log(err);
      }
    }

    // run initial fetch
    initialFetch();
  }, []);

  return (
    <div
      className={`${styles.cardContainer} ${styles.cardContainer2} ${styledStatus}`}
    >
      <div className={styles.cardTitle}>
        <p>{eachProposal.contents.title}</p>
        <p>id: {eachProposal.id}</p>
      </div>
      <div className={styles.cardStatusContainer2}>
        <p className={styles.cardStatusInfo}>
          <b>Voting status: </b>{" "}
          {voteStatus === true
            ? "Voted (approve)"
            : voteStatus === false
            ? "Voted (Reject)"
            : "No Vote"}
        </p>
        <div className={styles.voteTable}>
          <div className={`${styles.voteTableRow} ${styles.voteTableHeader}`}>
            <p
              className={`${styles.tableRowItem} ${styles.tableRowItemAddress}`}
            >
              Prep Address
            </p>
            <p>Vote</p>
          </div>
          {prepsVoting == null ? (
            <LoadingComponent />
          ) : (
            prepsVoting.map((eachPrep, index) => {
              return (
                <div className={styles.voteTableRow} key={uuidv4()}>
                  <p
                    className={`${styles.tableRowItem} ${styles.tableRowItemAddress}`}
                  >
                    {eachPrep[0]}
                  </p>
                  <p>
                    {eachPrep[1] === "0x1"
                      ? "Approve"
                      : eachPrep[1] === "0x0"
                      ? "Reject"
                      : "no vote"}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className={styles.cardStatusContainer}>
        <button
          className={`${styles.button} ${styles.buttonApprove}`}
          onClick={handleOnApprove}
          disabled={votingIsDisable && prepCanVote}
        >
          Approve
        </button>
        <button
          className={`${styles.button} ${styles.buttonReject}`}
          onClick={handleOnReject}
          disabled={votingIsDisable && prepCanVote}
        >
          Reject
        </button>
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
