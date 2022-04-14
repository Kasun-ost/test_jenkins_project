import {Decimal} from "decimal.js";

export function eth_decimal(num, decimalIndex = 18) {
  return new Decimal(num).div(10 ** decimalIndex);
}

export function eth_to_decimal(num, decimalIndex = 18) {
  return new Decimal(num).mul(10 ** decimalIndex);
}

export function pointReplenish(money) {
  if (!money && +money !== 0) {
    return "";
  }

  money = money + "";
  if (money.indexOf(".") < 0) {
    return money + ".00";
  }

  const sub = money.split(".").pop();
  if (sub.length <= 1) {
    return money + "0";
  }

  return money;
}
