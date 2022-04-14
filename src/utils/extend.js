
Object.defineProperty(Array.prototype, "asyncMap", {
  value(callback) {
    const list = this.valueOf();
    return Promise.all(list.map(callback));
  },
  enumerable: false,
});