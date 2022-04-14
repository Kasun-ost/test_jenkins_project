import Web3         from "web3";
import { useStore } from "vuex";
import {
  eth_decimal,
  pointReplenish,
}                   from "@/utils/common";

export default {
  state: {
    web3: null,
    type: null,
    user: {},
    myAddress: "",
    USDT_TEST: "USDT_TEST",
  },
  mutations: {
    SET_PROVIDER(state, { web3, type }) {
      state.web3 = web3;
      state.type = type;
    },
    SET_USER_INFO(state, user) {
      state.user = user;
    },
    SET_ADDRESS(state, myAddress) {
      state.myAddress = myAddress;
    },
  },
  actions: {
    async getUserInfo({ commit, state, rootState }) {
      if (state.type === state.USDT_TEST) {
        const bounds = rootState.bounds;

        try {
          console.log(bounds.usdt.methods.balanceOf);
          const pro = bounds.usdt.methods.balanceOf(state.myAddress).call();
          pro.then(res => {
            const balanceDecimal = res;
            const balance = pointReplenish(eth_decimal(balanceDecimal));

            commit("SET_USER_INFO", {
              balance,
              originBalance: balanceDecimal,
              address: state.myAddress,
            });
          }).catch(e => {
            console.error(e);
          });
        } catch (e) {
          console.error(e);
        }
      }
    },
    async createProvider({ commit, state }, type = window.ethereum) {
      let web3,
          currentAccount;
      if (window.ethereum) {
        try {
          const res = await new Promise((resolve, reject) => {
            window.ethereum.request({
              method: "eth_requestAccounts",
            }).then(res => {
              resolve(res);
            }).catch(e => reject(e));
          });
          currentAccount = res[0];
          commit("SET_ADDRESS", res[0]);
        } catch (error) {
          return {
            message: error.message,
            state: false,
          };
        }
      }
      if (type === state.USDT_TEST) {
        // web3 = await new Web3(new Web3.providers.HttpProvider(process.env.VUE_APP_BSC_PROVIDER));
        web3 = await new Web3(window.ethereum);
      } else {
        web3 = await new Web3(type);
      }

      window.web3Providers = web3;
      web3.eth.defaultAccount = currentAccount;
      commit("SET_PROVIDER", {
        type,
        web3,
      });

      // // 如果有装小狐狸的情况下
      // if (window.ethereum) {
      //   return await window.ethereum.request({
      //     method: "eth_requestAccounts"
      //   })
      //     .then(res => {
      //       commit("SET_ADDRESS", res[0]);
      //       // localStorage.setItem(res[0], '')
      //       // this.user_login(res[0]);
      //       // this.getWhitelist(res[0]);
      //       return {
      //         state: true,
      //       };
      //     })
      //     .catch(error => {
      //       return {
      //         message: error.message,
      //         state: false,
      //       };
      //     });
      // }
      return {
        state: true,
      };
    },
  },
};
