// utils/customLib.js
//
// Imports
import EspaniconSDKWeb from "@espanicon/espanicon-sdk";

// constants
const API_DATA = {
  mainnet: {
    nid: 1,
    node: "api.espanicon.team"
  },
  berlin: {
    nid: 7,
    node: "berlin.net.solidwallet.io"
  },
  local: {
    nid: 3,
    node: "server01.espanicon.team"
  }
};
// const USE_NID = API_DATA.berlin.nid;
// const API_NODE = API_DATA.berlin.node;
// const USE_NID = API_DATA.local.nid;
// const API_NODE = API_DATA.local.node;
const USE_NID = API_DATA.mainnet.nid;
const API_NODE = API_DATA.mainnet.node;

// Node-Butler Lib
//
export default class NodeButlerSDK extends EspaniconSDKWeb {
  constructor(apiNode = API_NODE, nid = USE_NID) {
    super(apiNode, nid);
    this.getCPSProposalFullInfoByHash = this.getCPSProposalFullInfoByHash.bind(
      this
    );
    this.getCPSProposalsFromNB = this.getCPSProposalsFromNB.bind(this);
    this.getPrepsFromNB = this.getPrepsFromNB.bind(this);
    this.getPrepFromNB = this.getPrepFromNB.bind(this);
    this.parsePrepFromNB = this.parsePrepFromNB.bind(this);
    this.getPrepLogoUrl = this.getPrepLogoUrl.bind(this);
    this.getAllNetworkProposalsFromNB = this.getAllNetworkProposalsFromNB.bind(
      this
    );
    this.preFormatRPCJSON = this.preFormatRPCJSON.bind(this);
    this.USE_NID = USE_NID;
    this.getParsedTxResult = this.getParsedTxResult.bind(this);
    this.setPrep = this.setPrep.bind(this);
  }
  async getAllNetworkProposalsFromNB() {
    const request = await this.queryMethod(
      "/node-butler/network-proposals",
      false,
      this.scores.apiHostnames.espanicon
    );
    return request;
  }
  async getCPSProposalFullInfoByHash(hash) {
    const url = {
      root: "gateway.ipfs.io",
      route: "/ipfs/" + hash
    };
    const request = await this.queryMethod(url.route, false, url.root);
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
  async getCPSProposalsFromNB() {
    const request = await this.queryMethod(
      "/node-butler/cps-proposals",
      false,
      this.scores.apiHostnames.espanicon
    );
    return request;
  }
  async getPrepsFromNB() {
    const request = await this.queryMethod(
      "/node-butler/preps",
      false,
      this.scores.apiHostnames.espanicon
    );
    return request;
  }
  async getPrepFromNB(prepAddress) {
    const request = await this.queryMethod(
      `/node-butler/preps/${prepAddress}`,
      false,
      this.scores.apiHostnames.espanicon
    );

    if (request.length < 1) {
      return null;
    } else {
      return request[0];
    }
  }
  parsePrepFromNB(prep) {
    let parsedPrep = { ...prep };
    parsedPrep.details = prep.has_valid_details
      ? JSON.parse(prep.details)
      : null;
    return parsedPrep;
  }

  getPrepLogoUrl(prepParsedData) {
    let logoUrl = null;

    try {
      if (prepParsedData.details.representative.logo == null) {
        // if the prep details doesnt have a logo entry
      } else {
        // if the prep details have a logo entry
        if (
          prepParsedData.details.representative.logo.logo_1024 == null ||
          prepParsedData.details.representative.logo.logo_1024 === ""
        ) {
          // if the logo_1024 entry is invalid check the rest
          if (
            prepParsedData.details.representative.logo.logo_256 == null ||
            prepParsedData.details.representative.logo.logo_256 === ""
          ) {
            // if the logo_256 entry is invalid check the rest
            if (
              prepParsedData.details.representative.logo.logo_svg == null ||
              prepParsedData.details.representative.logo.logo_svg === ""
              // if the logo_svg entry is invalid then there is no valid logo entry
            ) {
            } else {
              // if the logo_svg entry is valid use it
              logoUrl = prepParsedData.details.representative.logo.logo_svg;
            }
          } else {
            // if the logo_256 entry is valid use it
            logoUrl = prepParsedData.details.representative.logo.logo_256;
          }
        } else {
          // if the logo_1024 entry is valid use it
          logoUrl = prepParsedData.details.representative.logo.logo_1024;
        }
      }
    } catch (err) {
      console.log("error parsing prep details data for logo");
      console.log(err);
    }

    return logoUrl;
  }
  preFormatRPCJSON(rpcObj, from, readonly = true) {
    let formattedRPCJSON = {
      id: rpcObj.id,
      method: rpcObj.method,
      jsonrpc: rpcObj.jsonrpc,
      params: {
        ...rpcObj.params,
        // from: "hx0169e03001a3fa4012092ad4a4ddf2d07681f063"
        from: from
      }
    };

    if (readonly === false) {
      formattedRPCJSON.params = {
        ...formattedRPCJSON.params,
        timestamp: new Date().getTime() * 1000,
        nid: USE_NID,
        steplimit: 8000000,
        version: 1
        // nonce: 1
      };
    }

    console.log("formatted rpc json");
    console.log(formattedRPCJSON);
    return formattedRPCJSON;
  }

  async getParsedTxResult(hash) {
    // get transaction result by tx hash
    let txResult = {
      txExists: false,
      txHash: null,
      error: null,
      failure: null,
      status: 0
    };
    try {
      const result = await this.getTxResult(hash);
      return {
        ...txResult,
        ...result,
        txExists: true,
        status: parseInt(result.status, 16)
      };
    } catch (err) {
      console.log("error running getTxResult()");
      console.log(err);
      return {
        ...txResult,
        status: 0,
        txHash: hash,
        error: `Error running getTxResult(). ${err}`,
        failure: { code: "-1", message: err }
      };
    }
  }

  setPrep(wallet, prepData) {
    return this.makeTxCallRPCObj(
      wallet,
      this.scores.mainnet.governance,
      "setPRep",
      prepData
    );
  }
}

// let mock = {
//   contract: "cxa8676de7549b1ecf2b3a8526432ce71ffa6dbba7",
//   governance: "cx0000000000000000000000000000000000000000",
//   wallet: "hx0169e03001a3fa4012092ad4a4ddf2d07681f063"
// };
