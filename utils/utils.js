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

function parseBonderWallet(wallet) {
  return (
    data.tracker.foundation.root +
    data.tracker.foundation.routes.wallet +
    wallet
  );
}

const utils = { data, parseBonderWallet };

export default utils;
