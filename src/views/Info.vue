<template>
  <div class="info">
    <div class="title-container">
      <h2 class="title">详情</h2>
      <router-link :to="{name:'me'}"
                   class="right">我的NFT
      </router-link>
    </div>
    <div class="img"
         v-if="user.image && user.state !== 'error'"
         :style="{
            backgroundImage: `url('${user.image}')`,
            backgroundSize: 'cover',
        }">
      <img :src="user.image"
           @error="user.state = 'error'"
           :alt="user.name">
    </div>
    <div class="img"
         v-else>
      <span>暂无缩略图</span>
    </div>
    <div class="info-c">
      <div class="name text-center">{{ user.name }}</div>
      <div class="price text-center">{{ user.price }}</div>
      <div class="balance text-center">
        <span>钱包余额：</span>
        <span class="pl-5">{{ account.balance }}</span>
        <span class="pl-5">USDT</span>
      </div>
      <a class="buy"
         :class="{disabled:this.buttonState === 'loading'}"
         @click="onTransferSale">
        <span v-if="buttonState !== 'loading'">购买</span>
        <span v-else>Loading...</span>
      </a>
    </div>
  </div>
</template>

<script>
import {
  eth_decimal,
  eth_to_decimal,
  pointReplenish,
} from "@/utils/common";

export default {
  name: "Info",
  data() {
    return {
      user: {},
      buttonState: "start",
    };
  },
  computed: {
    boundsInfoState() {
      return this.$store.state.bounds;
    },
    web3() {
      return this.$store.state.web3;
    },
    account() {
      return this.$store.state.web3.user;
    },
  },
  async beforeMount() {
    await Promise.all([
      this.$store.dispatch("createMarketAbi"),
      this.$store.dispatch("createUsdtAbi"),
      this.$store.dispatch("createNftAbi"),
    ]);
    await this.$store.dispatch("getUserInfo");
    await this.getUser();
  },
  methods: {
    //todo: 召唤小狐狸交易
    async onTransferSale() {
      if (this.buttonState === "loading") {
        return;
      }

      this.buttonState = "loading";
      const token = this.$route.query.id;
      const usdt = this.boundsInfoState.usdt;
      const market = this.boundsInfoState.market;
      const account = this.account.address;
      const nft = this.boundsInfoState.nft;
      try {
        const saleAddress = "0x87BFE17D8D715C2d5006c8503000163BFDDa1003";
        const marketAddress = this.boundsInfoState.MARKET_CONTRACT;
        await usdt.methods.approve(marketAddress, this.user.originPrice).send({
          from: account,
        });
      } catch (e) {
        console.log(e);
        alert("授权失败");
        this.buttonState = "start";
        return;
      }

      try {
        //this.$store.state.web3.web3.utils.toWei(1,'wei')
        // nft价格*nft数量
        const mak = market.methods.buy(token, 1);
        const gasPrice = await mak.estimateGas({
          from: account,
        });
        const rsp = await mak.send({
          from: account,
          gas: gasPrice,
        });
        await this.$store.dispatch("getUserInfo");
        alert("购买成功");
      } catch (e) {
        console.log(e);
        alert("无法或取消了购买");
      }

      this.buttonState = "start";
    },
    async getUser() {
      if (this.$route.params.user) {
        this.user = this.$route.params.user;
        console.log(this.user);
      } else if (this.$route.query.id) {
        const token = this.$route.query.id;

        const url = await this.boundsInfoState.nft.methods.uri(token).call();
        const { data: user } = await this.$request({ url });
        const price = await this.boundsInfoState.market.methods.getNFTPrice(token).call();
        user.originPrice = price;
        user.price = pointReplenish(eth_decimal(price));
        this.user = user;
      } else {
        this.$router.replace({
          name: "404",
        }).catch();
      }
    },
  },
};
</script>

<style lang="scss"
       scoped>
.info {
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

.img {
  width: 60%;
  height: 240px;
  background-color: #fc9301;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #000;
  font-family: "微软雅黑 Light", sans-serif;
  font-weight: bold;
  text-shadow: 0 0 1px #999;
  letter-spacing: 2px;

  img {
    opacity: 0;
    width: 0;
    height: 0;
  }
}

.name {
  font-size: 24px;
  margin: 15px 0;
  line-height: 30px;
  color: #bdbcc5;
  font-weight: bold;
}

.price {
  color: #3173b0;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 0 1px #777;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    $SIZE: 30px;
    content: "";
    display: block;
    width: $SIZE;
    height: $SIZE;
    border-radius: 99px;
    background: #52ab93;
    margin-right: 5px;
  }
}

.balance {
  margin: 10px 0;
  color: #aaa;
}

.buy {
  width: 200px;
  height: 44px;
  line-height: 44px;
  margin: 20px auto;
  color: #fff;
  background: #a76dd3;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  &.disabled {
    background: darken(#a76dd3, 50%);
  }
}
</style>
