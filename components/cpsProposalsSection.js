import { useState, useEffect } from "react";
import styles from "../styles/cpsProposalsSection.module.css";
import { Hr, LoadingComponent } from "./customComponents";
import NodeButlerSDK from "../utils/customLib";
import { v4 as uuidv4 } from "uuid";
import GenericModal from "./genericModal";

const nodeButlerLib = new NodeButlerSDK();
const { getCPSProposalsFromNB, getCPSProposalFullInfoByHash } = nodeButlerLib;

export default function CPSProposalsSection({ localData }) {
  const [CPSProposals, setCPSProposals] = useState(null);
  const [proposalInfo, setProposalInfo] = useState(false);
  const [proposalIndex, setProposalIndex] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function handleCPSProposals(cpsData) {
    // validates and set the cps proposals state
    setCPSProposals(cpsData);
  }

  function handleModalOnClose() {
    setIsOpen(false);
    setProposalInfo(false);
    setProposalIndex(false);
  }

  async function handleModalOnOpen(index) {
    // open modal
    setIsOpen(true);
    setProposalIndex(index);

    // fetch proposal summary
    const proposalFullInfo = await getCPSProposalFullInfoByHash(
      CPSProposals[index]["ipfs_hash"]
    );

    // set proposal summary and comments in the proposalInfo state
    setProposalInfo(proposalFullInfo);
  }

  useEffect(() => {
    async function asyncFetch() {
      const cpsData = await getCPSProposalsFromNB();
      handleCPSProposals(cpsData);
      console.log("cpsData");
      console.log(cpsData);
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
        </p>
        <ul>
          <li>
            <b>Active:</b> Proposal has been approved and is currently ongoing.
          </li>
          <li>
            <b>Completed:</b> Proposal was approved during voting period and was
            completed successfully.
          </li>
          <li>
            <b>Disqualified:</b> Proposal got disqualified.
          </li>
          <li>
            <b>Paused:</b> Proposal has been paused.
          </li>
          <li>
            <b>Pending:</b> Proposal currently in voting period.
          </li>
        </ul>
      </div>
      <Hr />
      <div className={styles.body}>
        {CPSProposals == null ? (
          <LoadingComponent />
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
        {proposalInfo === false || proposalInfo == null ? (
          <div
            className={`${styles.proposalContainer} ${styles.proposalContainerIsWaiting}`}
          >
            <div className={styles.imgLoading}>
              {[1, 2, 3, 4, 5].map(foo => (
                <div className={styles.imgLoadingItem} key={uuidv4()}></div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.proposalContainer}>
            <h2>{proposalInfo.projectName}</h2>
            <div
              className={styles.proposalContainerInfo}
              dangerouslySetInnerHTML={{ __html: proposalInfo.description }}
            ></div>
            <div className={styles.proposalContainerComments}>
              <Hr />
              <h3>Votes:</h3>
              {proposalIndex === false ? (
                <>
                  <p>Fetching comments</p>
                  <div className={styles.imgLoading}>
                    {[1, 2, 3, 4, 5].map(foo => (
                      <div
                        className={styles.imgLoadingItem}
                        key={uuidv4()}
                      ></div>
                    ))}
                  </div>
                </>
              ) : CPSProposals[proposalIndex].comments.length < 1 ? (
                <p>No comments</p>
              ) : (
                <CommentsSection
                  commentArray={CPSProposals[proposalIndex].comments}
                />
              )}
            </div>
          </div>
        )}
      </GenericModal>
    </div>
  );
}

function CommentsSection({ commentArray }) {
  let voteStatus;
  return commentArray.map(commentData => {
    switch (commentData["vote"]) {
      case "_approve":
        voteStatus = "Approved";
        break;
      case "_reject":
        voteStatus = "Reject";
        break;
      case "_abstain":
        voteStatus = "Abstain";
        break;
      default:
        voteStatus = "Uknown";
    }
    return (
      <div className={styles.commentSectionContainer} key={uuidv4()}>
        <p style={{ marginLeft: "5px" }}>
          <b>Prep name:</b> {commentData["prep_name"]}
        </p>
        <p style={{ marginLeft: "5px" }}>
          <b>Vote:</b> {voteStatus}
        </p>
        <div style={{ display: "flex", flexFlow: "row wrap" }}>
          <p style={{ marginRight: "5px", marginLeft: "5px" }}>
            <b>Comment:</b>{" "}
          </p>
          <span
            dangerouslySetInnerHTML={{
              __html: commentData["vote_reason"]
            }}
          ></span>
        </div>
      </div>
    );
  });
}
