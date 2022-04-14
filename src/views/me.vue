<template>
  <div class="me">
    <div class="title-container">
      <h2 class="title">我的NFT</h2>
      <router-link :to="{name:'home'}" class="left">返回首页</router-link>
    </div>
    <ul class="list">
      <router-link :to="{name:'info',query:{id:user.id}}" class="card" v-for="user in customerList">
        <div class="img" v-if="user.image && user.state !== 'error'" :style="{
            backgroundImage: `url('${user.image}')`,
            backgroundSize: 'cover',
        }">
          <img :src="user.image" :alt="user.name" @error="user.state='error'"/>
        </div>
        <div class="img" v-else>
          <span>暂无缩略图</span>
        </div>
        <div class="info">
          <div class="name">{{ user.name }}</div>
          <div class="quantity">
            <span>拥有数量：{{ user.quantity }}</span>
          </div>
        </div>
      </router-link>
    </ul>
  </div>
</template>
<script>
import { useStore } from "vuex";

export default {
  name: "me",
  data() {
    return {
      customerList: [],
    };
  },
  computed:{
    account(){
      return this.$store.state.web3.user;
    },
    boundsState(){
      return this.$store.state.bounds;
    },
    nftIdList(){
      return this.$store.state.nft.idList;
    },
  },
  async beforeMount() {
    await Promise.all([
      this.$store.dispatch("createMarketAbi"),
      this.$store.dispatch("createUsdtAbi"),
      this.$store.dispatch("createNftAbi")
    ]);
    await this.$store.dispatch("getUserInfo");
    await this.getNftList();


    console.log(this.account.address);
    let ids = [...this.nftIdList];
    const results = await this.boundsState.market.methods.getUserNFTs(ids.map(() => this.account.address), ids).call();

    ids = ids.filter((x, i) => +results[i]);

    const userJsonList = await ids.asyncMap(token => this.boundsState.nft.methods.uri(token).call());
    const requestUserList = await userJsonList.asyncMap(url => this.$request({
      url,
    }));
    // const test = await this.boundsState.nft.methods.uri(results[0]).call()
    // const prices  = await ids.asyncMap(token => this.boundsState.market.methods.getNFTPrice(token).call())
    // const nftList = results.flat();
    const userList = requestUserList.map((rsp, i) => {
      return {
        id: ids[i],
        ...rsp.data,
        quantity: results[i],
      };
    });

    this.customerList = userList;
  },
  methods: {
    getNftList() {

    }
  }
};
</script>

<style scoped lang="scss">
.me {
  background: #484265;
  min-height: inherit;
}

.title-container {
  overflow: hidden;
  position: relative;
  padding-bottom: 30px;

  .title {
    color: #b39551;
    text-align: center;
  }

  .left {
    position: absolute;
    padding: 10px 5px;
    left: 0;
    top: 0;
    color: #a66445;
    text-shadow: -1px 0 1px lighten(#a66445, 5%);
  }
}

.list {
  margin: 0 10px;
  padding: 0 0 10px;
  list-style: none;
  display: grid;
  grid-template-columns: 50% 50%;

  .card {
    margin: 5px;
    border-radius: 10px;
    background: #3e3957;
    box-shadow: 0 0 4px 0 darken(#3e3957, 5%);
    border: 1px solid darken(#3e3957, 2%);

    .img {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #afafaf;
      font-family: '微软雅黑 Light', sans-serif;
      font-weight: bold;
      text-shadow: 0 0 1px #ddd;
      letter-spacing: 2px;

      img {
        opacity: 0;
        width: 0;
        height: 0;
      }

      span {
      }
    }

    .info {
      padding-left: 10px;
      line-height: 26px;
    }

    .name {
      color: #dfdfdf;
      font-weight: bold;
    }

    .quantity{
      color: #dfdfdf;
      font-weight: 100;
    }
  }
}
</style>
