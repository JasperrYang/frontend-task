## Vue.js 源码剖析-响应式原理、虚拟 DOM、模板编译和组件化

### 简答题

#### 1、请简述 Vue 首次渲染的过程。

![Vue首次渲染过程.png](https://upload-images.jianshu.io/upload_images/6010417-6911e88046677f05.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 1.Vue 初始化，调用 new Vue() 之前，已经初始化完毕

- 实例成员
    - _init() 方法
    - $data、$props、$set、$delete、$watch 属性
    - _update、$forceUpdate、$destroy 生命周期相关方法
    - $on、$once、$off、$emit 事件
    - $nextTick、_render 方法
- 静态方法
    - config、observable、util 对象
    - options 对象，并扩展 components、directives、filters、_base 方法
    - set、delete、nextTick 方法
    - keep-alive 组件
    - Vue.use()、Vue.mixin()、 Vue.extend()、Vue.directive()、 Vue.component()、Vue.filter()
- 平台相关
    - 全局之类：v-model、v-show
    - 全局组件：v-transition、v-transition-group
    - 全局方法：`__patch__`、$mount
    - $mount
    - Vue.compile()

### 2.实例化 Vue，调用 this._init() 方法

- vm 的生命周期相关变量初始化，$children/$parent/$root/$refs
- vm 的事件监听初始化，父组件绑定在当前组件上的事件
- vm 的编译 render 初始化，$slots/$scopedSlots/_c/$createElement/$attrs/$listeners
- **beforeCreate 生命钩子回调**
- 把 inject 的成员注入到 vm 上
- 初始化 vm 的 _props/methods/_data/computed/watch
- 初始化 provide
- 调用 `entry-runtime-with-compiler.js`入口文件中的 `this.$mount`
- **created 生命钩子回调**

### 3.编译模板，此处有两个 `this.$mount` 函数

- `entry-runtime-with-compiler.js`文件中的 `this.$mount`，这个`$mount()` 的核心作用是帮我们把模板编译成 render 函数
    - 将 `/src/platforms/web/runtime/index.js`文件中的 `this.$mount` 中的 `$mount` 保存后重写
    - 判断 options 中是否存在 render 函数，如果存在直接调用 `/src/platforms/web/runtime/index.js` 中的 `$mount`
    - 不存在则将编译 template 模板
        - 获取 options 中的 template，如果不存在则将获取 el 的 outerHTML 作为模板
        - 如果存在的话获取对应 DOM 对象的 innerHTML 作为模板
            - 如果 template 类型是 string 类型，获取 id 选择器
            - 如果 template 是元素节点，返回元素的 innerHTML
            - 如果以上都不是，警告并返回当前实例
        - 调用 compileToFunctions 将 template 转为 render 函数
    - 调用`/src/platforms/web/runtime/index.js` 中的 `$mount`
- `/src/platforms/web/runtime/index.js`文件中的 `this.$mount`
    - 重写获取 el，防止运行时版本没有执行上一步
    - 调用 mountComponent 开始挂载组件

### 4.挂载组件，页面渲染

- 判断是否有 render 选项，如果没有并且是开发环境并传入了 template 发送警告
- **beforeMount 生命钩子回调**
- 定义 updateComponent，这个方法最终会调用 `vm._update` 对比更新视图，这里只是定义
- 创建 watcher 实例，将 updateComponent 当作参数传入。
    - watcher 构造函数中会调用 watcher.get() 方法，get() 方法中会调用 `updateComponent` 函数
    - 调用 vm._render() 创建 VNode
    - 调用 vm.update() 挂载真实 DOM
- **mounted 生命钩子回调**
- 返回 Vue 实例

#### 2、请简述 Vue 响应式原理。

#### 3、请简述虚拟 DOM 中 Key 的作用和好处。

#### 4、请简述 Vue 中模板编译的过程。
