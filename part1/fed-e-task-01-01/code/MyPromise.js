/**
 * 尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
 * 1 传入执行器，立即执行
 * 2 三种状态，成功 fulfilled 失败 rejected 等待 pending，且不可更改
 * 3 resolve和reject函数用来更改状态
 * 4 then方法有两个回调函数,,成功调用成功的回调函数,失败调用失败回调函数
 * 5 then方法是可以被链式调用的，后面then方法的回调函数拿到值的是上一个then方法的回调函数的返回值
 */

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(executor) {
    try {
      // 传入执行器，立即执行
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  status = PENDING;
  value = undefined;
  reason = undefined;
  successCallback = [];
  failedCallback = [];

  // 成功调用
  resolve = (value) => {
    // 只处理等待状态，以此控制状态不可逆
    if (this.status !== PENDING) return;
    // 更改状态
    this.status = FULFILLED;
    // 保存传入，以便异步方法调用
    this.value = value;
    // 实现 then 的链式调用
    while (this.successCallback.length)
      this.successCallback.shift()(this.value);
  };
  // 失败调用
  reject = (reason) => {
    // 只处理等待状态，以此控制状态不可逆
    if (this.status !== PENDING) return;
    // 更改状态
    this.status = REJECTED;
    // 保存传入，以便异步方法调用
    this.reason = reason;
    // 实现 then 的链式调用
    while (this.failedCallback.length) this.failedCallback.shift()(this.reason);
  };

  then(successCallback, failedCallback) {
    // 参数可选
    successCallback = successCallback ? successCallback : (value) => value;
    failedCallback = failedCallback
      ? failedCallback
      : (reason) => {
          throw reason;
        };
    // 链式调用 then 返回的是一个 promise 对象
    const promise = new MyPromise((resolve, reject) => {
      try {
        // 成功调用成功回调
        if (this.status === FULFILLED) {
          // 变为异步执行，等待 promise 返回
          setTimeout(() => {
            let result = successCallback(this.value);
            resolvePromise(promise, result, resolve, reject);
          }, 0);
          // 失败调用失败回调
        } else if (this.status === REJECTED) {
          failedCallback(this.reason);
        } else {
          // 等待状态：异步函数，保存数据
          this.successCallback.push(successCallback);
          this.failedCallback.push(failedCallback);
        }
      } catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  static all(array) {
    let result = [];
    let count = 0;
    function addDate(index, data) {
      result[index] = data;
      count++;
      // 确保所有的方法全部成功才resolve
      if (count === array.length) {
        resolve(result);
      }
    }

    array.forEach((element, index) => {
      if (element instanceof MyPromise) {
        element.then(
          (value) => addDate(index, value),
          (reason) => reject(reason)
        );
      } else {
        addDate(index, element);
      }
    });
  }

  static resolve(value) {
    // 返回一个promise对象
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  finally(callback) {
    // 不管执行失败还是成功都会调用
    return this.then(
      (value) => {
        // 可以链式调用then方法拿到finally最终的结果,因此返回一个Promise对象
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }

  catch(failCallback) {
    return this.then(undefined, failCallback);
  }
}

function resolvePromise(promise, result, resolve, reject) {
  // then方法返回的promise对象不可以上一步的返回
  if (promise === result) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  // 返回的是一个新的promise对象
  if (result instanceof MyPromise) {
    result.then(resolve, reject);
  } else {
    resolve(result);
  }
}
