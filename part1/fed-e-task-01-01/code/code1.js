/*
  将下面异步代码使用 Promise 的方法改进
  尽量用看上去像同步代码的方式
  setTimeout(function () {
    var a = 'hello'
    setTimeout(function () {
      var b = 'lagou'
      setTimeout(function () {
        var c = 'I ♥ U'
        console.log(a + b +c)
      }, 10)
    }, 10)
  }, 10)
*/
const promise = new Promise((resolve, reject) => {
  resolve();
});

promise
  .then(() => {
    return "hello";
  })
  .then((value) => {
    return value + " lagou";
  })
  .then((value) => {
    console.log(value + " I ♥ U");
  });
