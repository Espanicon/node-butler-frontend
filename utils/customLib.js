// utils/customLib.js
//
// Imports
import EspaniconSDKWeb from "@espanicon/espanicon-sdk";

// Node-Butler Lib
//
export default class NodeButlerSDK extends EspaniconSDKWeb {
  constructor() {
    super();
    this.getCPSProposalFullInfoByHash = this.getCPSProposalFullInfoByHash.bind(
      this
    );
    this.getCPSProposalsFromNB = this.getCPSProposalsFromNB.bind(this);
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
}
