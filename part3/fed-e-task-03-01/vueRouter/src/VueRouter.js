let _Vue = null;
let isHash = null;

export default class VueRouter {
  constructor(options) {
    this.options = options;
    isHash = options.mode !== 'history';
    // 记录路径和对应的组件
    this.routeMap = {};
    this.data = _Vue.observable({
      // 当前的默认路径
      current: '/',
    });
    console.log(this.data);
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }

  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    _Vue.mixin({
      beforeCreate() {
        // 判断 router 对象是否已经挂载了 Vue 实例上
        if (this.$options.router) {
          // 把 router 对象注入到 Vue 实例上
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }

  // 遍历所有的路由规则 吧路由规则解析成键值对的形式存储到routeMap中
  createRouteMap() {
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
    console.log(this.routeMap);
  }
  // 创建 router-link 和 router-view 组件
  initComponent(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          if (!isHash) {
            // 改变地址，不发送请求，记录地址历史
            history.pushState({}, "", this.to);
            this.$router.data.current = this.to;
          } else {
            window.location.href = '#' + this.to;
          }
          // 阻住后续执行，不让超链接跳转
          e.preventDefault();
        },
      },
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        const cm = self.routeMap[self.data.current];
        return h(cm);
      },
    });
  }
  // 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
  initEvent() {
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });

    // 监听URL片段标识符变化
    window.addEventListener("hashchange", () => {
      this.data.current = window.location.hash.replace("#", "");
    });
  }
}
