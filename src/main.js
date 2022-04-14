import app       from "./start.js";
import router    from "./router";
import store     from "./store";
import request   from "./utils/request";
import {Decimal} from "decimal.js";

Decimal.set({rounding: 0, toExpPos: 40, toExpNeg: -10});

import "@/utils/extend";

app.use(store).use(router);
app.config.globalProperties.$request = request;
app.config.globalProperties.Decimal = Decimal;
app.mount("#app");
