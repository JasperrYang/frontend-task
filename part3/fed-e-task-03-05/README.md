## 简答题

（请直接在本文件中作答）

#### 1、Vue 3.0 性能提升主要是通过哪几方面体现的？

1. 响应式系统的升级

- Vue 2.0 使用 defineProperty
    - defineProperty 代理对象中的某个属性
    - 初始化时将 data 中的数据进行处理，如果属性时 object 类型还需要递归处理
- Vue 3.0 使用 Proxy 对象重写响应式系统
    - Proxy 代理整个对象
    - 调用时递归
    - 可以监听动态新增的属性
    - 可以监听删除的属性
    - 可以监听数组的索引和 length 属性

2. 编译优化

- Vue 2.0 中通过标记静态根节点，优化 diff 过程
- Vue 3.0 中标记和提升所有的静态根节点，diff 只需要对比动态节点内容
    - Fragments
    - 静态提升
    - Patch flag
    - 缓存事件处理函数

3. 源码体积优化

- Vue 3.0 中移除了一些不常用的 API
    - inline-tempalte、filter
- Tree-shaking

#### 2、Vue 3.0 所采用的 Composition Api 与 Vue 2.x使用的Options Api 有什么区别？

1. Vue 2.0 Options Api

> 在一个 `vue` 文件中使用 `data`、`methods`、`computed`、`watch` 定义属性和方法，共同处理页面逻辑

**问题：当组件开始变得更大时，逻辑关注点的列表也会增长。尤其对于那些一开始没有编写这些组件的人来说，这会导致组件难以阅读和理解。**

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // 使用 `this.user` 获取用户仓库
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

2. Vue 3.0 Composition Api

> 在 Composition API 中，代码是根据逻辑功能来组织的，一个功能的所有 API 会放在一起（高内聚，低耦合）

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 因为我们并不关心未经过滤的仓库
      // 我们可以在 `repositories` 名称下暴露过滤后的结果
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

#### 3、Proxy 相对于 Object.defineProperty 有哪些优点？

- defineProperty 代理对象中的某个属性，Proxy 代理整个对象
- defineProperty 无法监控到数组下标的变化， Proxy 可以

#### 4、Vue 3.0 在编译方面有哪些优化？

- Vue 2.0 中通过标记静态根节点，优化 diff 过程
- Vue 3.0 中标记和提升所有的静态根节点，diff 只需要对比动态节点内容
    - Fragments
    - 静态提升
    - Patch flag
    - 缓存事件处理函数

#### 5、Vue.js 3.0 响应式系统的实现原理？

Vue 3.0 的响应式系统是独立的模块，可以完全脱离 Vue 而使用，而贯穿整个响应式系统得无非是 reactive、effect 方法

- reactive：通过 Proxy 设置 get、set、deleteProperty 代理，返回对象的响应式副本。
    - get：收集依赖，递归将代理对象转成响应式对象
    - set：更新值并触发更新
    - deleteProperty：删除并触发更新

- effect：立即执行传入的一个函数，同时响应式追踪其依赖，并在其依赖变更时重新运行该函数

### 依赖收集-track

当 effect 被立即执行时，触发代理对象的 getter 方法，get 方法内部会调用 track 方法将属性与对应的 effect 函数建立依赖关系

![](https://raw.githubusercontent.com/JasperrYang/frontend-note/main/03-05-Vue3.0/img/docs-reactive.png)

```js
let activeEffect = null
function effect(callback) {
  activeEffect = callback
  callback()
  activeEffect = null
}

let targetMap = new WeakMap()
function track(target, key) {
  if(!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) targetMap.set(target, (depsMap = new Map()))
  let dep = depsMap.get(key)
  if (!dep) depsMap.set(key, (dep = new Set()))
  dep.add(activeEffect)
}
```

### 触发更新-trigger

更新/删除属性时触发代理对象的 setter 方法，set 内部调用 trigger 方法进行更新操作。

trigger 会去依赖记录中查找对应字段依赖的 effect 并依次执行

```js
function trigger(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => {
      effect()
    })
  }
}
```
