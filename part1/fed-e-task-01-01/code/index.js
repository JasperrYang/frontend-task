const MyPromise = require("./myPromise");

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    console.log("hahaha");
  }, 0);
  resolve("hello");
}).then((result) => result);

const p2 = new MyPromise((resolve, reject) => {
  // throw new Error("报错了");
  resolve("world");
}).then((result) => result);

MyPromise.all([p1, p2]).then(
  (value) => {
    console.log(11);
    console.log(value);
  },
  (reason) => {
    console.log(reason);
  }
);
