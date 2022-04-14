import {createStore} from "vuex";
import web3          from "./modules/web3";
import bounds        from "./modules/bounds";
import nft           from "./modules/nft";

export default createStore({
  modules: {
    web3,
    bounds,
    nft,
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {
    nft_id_list: state => state.nft.idList
  },
});
