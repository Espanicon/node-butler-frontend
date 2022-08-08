const data = {
  tracker: {
    foundation: {
      root: "https://tracker.icon.foundation",
      routes: {
        wallet: "/address/"
      }
    },
    community: {
      root: "https://tracker.icon.community",
      routes: {
        wallet: "/address/"
      }
    }
  }
};

const samples = {
  details: `{
    representative: {
      logo:{
      logo_256: "http://somesite.com/logo-small.jpg",
      logo_1024: "http://somesite.com/logo-big.jpg",
      logo_svg: "http://somesite.com/logo.svg"
    },
    media: {
      steemit: "",
      twitter: "",
      youtube: "",
      facebook: "",
      github: "",
      reddit: "",
      keybase: "",
      telegram: "",
      wechat: ""
    }
  }`,
  setPrep: `{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "icx_sendTransaction",
  "params": {
      "data": {
          "method": "setPRep",
          "params": {
              "name": "ABC Node",
              "email": "abc@example.com",
              "country": "KOR",
              "city": "Seoul",
              "website": "https://abc.example.com/",
              "details": "https://abc.example.com/details/",
              "nodeAddress": "hxe7af5fcfd8dfc67530a01a0e403882687528dfcb"
          }
      },
  }
}`,
  details2: {
    representative: {
      logo: {
        logo_256: "http://somesite.com/logo-small.jpg",
        logo_1024: "http://somesite.com/logo-big.jpg",
        logo_svg: "http://somesite.com/logo.svg"
      },
      media: {
        steemit: "",
        twitter: "",
        youtube: "",
        facebook: "",
        github: "",
        reddit: "",
        keybase: "",
        telegram: "",
        wechat: ""
      }
    },
    server: {
      location: {
        country: "USA",
        city: "Houston"
      },
      server_type: "cloud",
      api_endpoint: "127.0.0.1:9000"
    }
  }
};

function parseBonderWallet(wallet) {
  return (
    data.tracker.foundation.root +
    data.tracker.foundation.routes.wallet +
    wallet
  );
}

function parseGetBonderList(getBonderListResponse) {
  if (getBonderListResponse == null) {
    return [];
  } else {
    return getBonderListResponse.bonderList;
  }
}
function prepareForQueryMethod(url) {
  const urlObject = new URL(url);
  return urlObject;
}

function parseBonderFormInputs(rawInputState) {
  //
  console.log(rawInputState);
}
function parsePrepFormInputs(rawInputState) {
  //
  console.log(rawInputState);
}

const utils = {
  data,
  samples,
  parseBonderWallet,
  parseGetBonderList,
  prepareForQueryMethod,
  parseBonderFormInputs,
  parsePrepFormInputs
};

export default utils;
