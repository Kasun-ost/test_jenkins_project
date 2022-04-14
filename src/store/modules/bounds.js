import {useStore} from "vuex";

export default {
  state: {
    MARKET_CONTRACT: "0x2EEB32B3F9c16B113BC947E82bF7E055b264CFCa",
    USDT_CONTRACT: "0x8567c957d50dB33f7D73631c24A2b3037F9be657",
    NFT_CONTRACT: "0xef32D08E6BA8A4E0157Bc30432f38cd809010120",
    market: {},
    usdt: {},
    nft: {},
  },
  mutations: {
    SET_MARKET_ABI(state, abi) {
      state.market = abi;
    },
    SET_USDT_ABI(state, abi) {
      state.usdt = abi;
    },
    SET_NFT_ABI(state, abi) {
      state.nft = abi;
    },
  },
  actions: {
    async createMarketAbi({state, commit}) {
      const store = useStore();
      const marketAbi = (await import("@/utils/abi/market.json"))?.default;
      const web3 = store.state.web3.web3;
      if (marketAbi) {
        //todo: 理论上还要判断返回值来对应显示合约地址是否违法等等提示
        commit("SET_MARKET_ABI", await new web3.eth.Contract(marketAbi, state.MARKET_CONTRACT));
      }
    },
    async createUsdtAbi({state, commit}) {
      const store = useStore();
      const usdtAbi = (await import("@/utils/abi/usdt.json"))?.default;
      const web3 = store.state.web3.web3;
      if (usdtAbi) {
        commit("SET_USDT_ABI", await new web3.eth.Contract(usdtAbi, state.USDT_CONTRACT));
      }
    },
    async createNftAbi({state, commit}) {
      const store = useStore();
      const nftAbi = (await import("@/utils/abi/nft.json"))?.default;
      const web3 = store.state.web3.web3;
      if (nftAbi) {
        commit("SET_NFT_ABI", await new web3.eth.Contract(nftAbi, state.NFT_CONTRACT));
      }
    },
  }
};