<template>
  <router-view />
</template>

<script>
import {useStore} from "vuex";

export default {
  name: "AbiLayout",
  data() {
    return {
      abiStatus: false,
    };
  },
  async beforeMount() {
    const store = useStore();

    // await Promise.all([
    //   store.dispatch("createMarketAbi"),
    //   store.dispatch("createUsdtAbi"),
    //   store.dispatch("createNftAbi")
    // ]);
    // await store.dispatch("getUserInfo");
    // this.abiStatus = true;
  }
};
</script>

<style scoped>

</style>
