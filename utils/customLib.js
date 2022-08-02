// utils/customLib.js
//
// Imports
import EspaniconSDKWeb from "@espanicon/espanicon-sdk";
const webLib = new EspaniconSDKWeb();
const {
  getScoreApi, // tested
  getIcxBalance, // tested
  getTxResult, // tested
  getTxByHash, // tested
  getPrep, // tested
  parsePrepData, // TODO:cannot be tested with current setup
  getPreps, // tested
  getBonderList, // tested
  setBonderList, // tested
  getLastBlock, // tested
  getCPSPeriodStatus, // tested
  getCPSProposalKeysByStatus, // tested
  getCPSProposalDetailsByHash, // tested
  getCPSProposalVoteResultsByHash, // tested
  getAllCPSProposals, //tested TODO: is commented out because it takes too long
  getScoreStatus, // tested
  getStepPrice, // tested
  getStepCosts, // tested
  getMaxStepLimit, // tested
  isInScoreBlackList, // tested
  getVersion, // tested
  getRevision, // tested
  getProposal, // tested TODO: returns error on valid proposals
  getProposals, // tested
  approveNetworkProposal, // tested
  rejectNetworkProposal, //tested
  scores,
  queryMethod: customFetch
} = webLib;

// CPS methods
//
async function getCPSProposalFullInfoByHash(hash) {
  const url = {
    root: "gateway.ipfs.io",
    route: "/ipfs/" + hash
  };
  const request = await customFetch(url.route, false, url.root);
  if (request == null) {
    // Error was raised and handled inside customRequest, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    return request;
  }
}

// Node-Butler API
//
const nodeButlerHostname = scores.apiHostnames.espanicon;
const nodeButlerRoutes = {
  cps: "/node-butler/cps-proposals"
};
async function getCPSProposalsFromNB() {
  const request = await customFetch(
    nodeButlerRoutes.cps,
    false,
    nodeButlerHostname
  );
  return request;
}
const lib = {
  cps: {
    getCPSPeriodStatus,
    getCPSProposalKeysByStatus,
    getCPSProposalDetailsByHash,
    getCPSProposalVoteResultsByHash,
    getAllCPSProposals,
    getCPSProposalFullInfoByHash
  },
  governance: {
    getScoreApi,
    getIcxBalance,
    getTxResult,
    getTxByHash,
    getPrep,
    parsePrepData,
    getPreps,
    getBonderList,
    setBonderList,
    getLastBlock
  },
  governance2: {
    getScoreStatus,
    getStepPrice,
    getStepCosts,
    getMaxStepLimit,
    isInScoreBlackList,
    getVersion,
    getRevision,
    getProposal,
    getProposals,
    approveNetworkProposal,
    rejectNetworkProposal
  },
  nodeButler: {
    getCPSProposalsFromNB
  }
};

module.exports = lib;
