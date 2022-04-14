<template>
  <div class="home">
    <div class="title-container">
      <h2 class="title">大厅</h2>
      <router-link :to="{name:'me'}" class="right">我的NFT</router-link>
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
          <div class="description">{{ user.description }}</div>
          <div class="money" v-if="user.displayPrice">
            <span>{{ user.price }}</span>
            <span class="pl-5">USDT</span>
          </div>
        </div>
      </router-link>
    </ul>
  </div>
</template>
<script>
import {
  eth_decimal,
  pointReplenish
}                 from "@/utils/common";

export default {
  name: "Bounds",
  data() {
    return {
      customerList: [],
    };
  },
  computed:{
    nftIdList(){
      return this.$store.state.nft.idList;
    },
    boundsState(){
      return this.$store.state.bounds;
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
  },
  methods: {
    async getNftList() {
      const ids = this.nftIdList;


      const userJsonList = await ids.asyncMap(token => this.boundsState.nft.methods.uri(token).call());
      const requestUserList = await userJsonList.asyncMap(url => this.$request({
        url,
      }));
      this.customerList = requestUserList.map((req, i) => {
        return {
          id: ids[i],
          ...req.data
        };
      });

      const prices = await ids.asyncMap(token => this.boundsState.market.methods.getNFTPrice(token).call());
      this.customerList.forEach((user, i) => {
        user.displayPrice = true;
        user.originPrice = prices[i];
        user.price = pointReplenish(eth_decimal(prices[i]));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
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

  .right {
    position: absolute;
    padding: 10px 5px;
    right: 0;
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
      color: #afafaf;
    }

    .description {
      color: #dfdfdf;
    }

    .money {
      color: #54afbf;
      padding-bottom: 5px;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;

      &:before {
        content: "";
        display: block;
        width: 14px;
        height: 14px;
        border-radius: 99px;
        background: #6275d7;
        margin-right: 5px;
      }
    }
  }
}
</style>
