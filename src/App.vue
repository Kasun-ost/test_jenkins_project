<template>
  <div class="body">
    <div class="loading"
         v-if="state === 'loading'">
      <div class="flex left">
        <div>Loading</div>
        <div class="fixed-width-40">
          <span :class="{'opacity-0': $index > loadingCount}"
                v-for="(i,$index) in '_'.repeat(MAX_LOADING_COUNT).split('')">.</span>
        </div>
      </div>
    </div>
    <template v-else>
      <h1 class="title">iPhone 13 Max Pro</h1>
      <div class="media-container">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  mounted() {
    this.createProvider();
    this._LOADING_COUNT = this.setLoadingState();
  },
  computed: {
    MAX_LOADING_COUNT() {
      return 5;
    },
  },
  data() {
    return {
      loadingCount: 0,
      state: "loading",
    };
  },
  beforeUnmount() {
    clearInterval(this._LOADING_COUNT);
  },
  methods: {
    async createProvider() {
      const store = useStore();
      const result = await store.dispatch("createProvider", store.state.web3.USDT_TEST);
      if (result.state) {
        setTimeout(() => {
          this.state = "finish";
        }, 0);
      } else {
        alert(result.message);
      }
    },
    setLoadingState() {
      return setInterval(() => {
        this.loadingCount = (this.loadingCount + 1) % this.MAX_LOADING_COUNT;
      }, 500);
    },
  },
};
</script>

<style lang="scss"
       scoped>
.body {
  min-height: 100vh;
}

.loading {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 1px #000;
  color: #aaa;

  span {
    transition: .2s linear;
    opacity: 1;
  }

  span.opacity-0 {
    opacity: 0;
  }
}

:root.is-pc {
  .body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    flex-wrap: nowrap;
    flex-grow: 1;
    background: #fafafa;

    .title {
      margin-top: 0;
      flex-shrink: 0;
    }
  }

  .media-container {
    $DPR: 4;
    width: 1284px / $DPR;
    height: 2778px / $DPR;
    min-height: 2778px / $DPR;
    flex-basis: 2778px / $DPR;
    flex-shrink: 0;
    margin: 0 auto 30px;
    background: #fff;
    border: 1px solid #cfcfcf;
    border-radius: 5px;
    overflow: auto;
  }
}

:root.is-mobile {
  .media-container {
    position: relative;
    min-height: inherit;
  }

  .title {
    display: none;
  }
}
</style>
<style lang="scss">
@import "normalize.css";

body {
  margin: 0;
  padding: 0;
}

:root, .media-container {
  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-track-piece {
    background: #474165;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(#ddd, .5);
  }
}

.float-left {
  float: left;
}

.nowrap {
  white-space: nowrap;
}

.flex {
  display: flex;

  &.left {
    align-items: flex-start;
  }
}

.opacity-0 {
  opacity: 0;
}

.pl-5 {
  padding-left: 5px;
}

.text-center {
  text-align: center;
}

a, a:active {
  text-decoration: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
