## 一、简答题

### 1、当我们点击按钮的时候动态给 data 增加的成员是否是响应式数据，如果不是的话，如何把新增成员设置成响应式数据，它的内部原理是什么。

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

给 dog 对象的 obj 动态增加的成员，没有经过 observe 处理，所以该成员不是响应式的；

重新赋值，经过 observe 处理，生成对应的 get/set 方法

```js
this.dog = { name: 'Trump' }
```

### 2、请简述 Diff 算法的执行过程

> `oldCh` 和 `newCh` 各有两个头尾的变量 `oldStartIdx` 、 `oldEndIdx`、 `newStartIdx`、`newEndIdx`，它们的 2 个变量相互比较，一共有 4 种比较方式。如果4种比较都没匹配，如果设置了 `key`，就会用 `key` 进行比较，在比较的过程中，变量会往中间靠，一旦 `newStartIdx > newEndIdx` 或 `oldStartIdx > oldEndIdx` 表明 `oldCh` 和 `newCh` 至少有一个已经遍历完了，就会结束比较。

- 循环遍历比对
    - `oldStartVnode` | `newStartVnode`
        ![image.png](https://upload-images.jianshu.io/upload_images/6010417-3cfcb752d3c7c59d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把旧开始和新开始索引往后移动 oldStartIdx++ / newStartIdx++
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldEndVnode` | `newEndVnode`
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把旧开始和新开始索引往前移动 oldStartIdx-- / newStartIdx--
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldStartVnode` | `newEndVnode`
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-56385938d9b62dbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把 oldStartVnode 对应的 DOM 元素，移动到右边，更新索引
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - `oldEndVnode` | `newEndVnode`
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-d12e302d14226fbd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 如果新旧开始节点是 sameVnode (key 和 sel 相同)
        - 调用 patchVnode() 对比和更新节点
        - 把 oldEndVnode 对应的 DOM 元素，移动到左边，更新索引
        - 如果新旧节点不是 sameVnode，则进行下一步比对
    - 非上述四种情况
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-cda9169d69162e57.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
        - 遍历新节点，使用 newStartNode 的 key 在老节点数组中找相同节点
        - 如果没有找到，说明 newStartNode 是新节点，创建新节点对应的 DOM 元素，插入到 DOM 树中
        - 如果找到了，判断新节点和找到的老节点的 sel 选择器是否相同
            - 如果不相同，说明节点被修改了，重新创建对应的 DOM 元素，插入到 DOM 树中
            - 如果相同，把 elmToMove 对应的 DOM 元素，移动到左边

- 循环结束
    - 当老节点的所有子节点先遍历完 (oldStartIdx > oldEndIdx)， 循环结束
![image.png](https://upload-images.jianshu.io/upload_images/6010417-95e50a91005423f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        - 说明新节点有剩余，把剩余节点批量插入到右边
    - 新节点的所有子节点先遍历完 (newStartIdx > newEndIdx)，循环结束
    ![image.png](https://upload-images.jianshu.io/upload_images/6010417-35c51fe429cb9a38.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

        - 说明老节点有剩余，把剩余节点批量删除

- key 的作用

    - 通过 key 值来精确地判断两个节点是否为同一个，从而避免频繁更新不同元素，减少不必要的DOM操作，提高性能。
    - 使用同标签名元素的过渡切换是也需要加key属性，让他们区分开来，否则虚拟 DOM 同标签名只会更新内容

## 二、编程题

### 1、模拟 VueRouter 的 hash 模式的实现，实现思路和 History 模式类似，把 URL 中的 # 后面的内容作为路由的地址，可以通过 hashchange 事件监听路由地址的变化。

### 2、在模拟 Vue.js 响应式源码的基础上实现 v-html 指令，以及 v-on 指令。

### 3、参考 Snabbdom 提供的电影列表的示例，利用Snabbdom 实现类似的效果，如图：

<img src="images/Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449.png" alt="Ciqc1F7zUZ-AWP5NAAN0Z_t_hDY449" style="zoom:50%;" />
