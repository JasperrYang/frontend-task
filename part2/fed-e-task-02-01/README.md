## 简答题

**1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。**

答: 工程化是在开发阶段使用提高效率的语法、规范和标准，将源代码自动构建为生产代码的过程。

- 解析转化 ES6 语法、less、sass 等预处理 css
- 完成上线需要压缩代码等重复工作
- 统一开发规范，编码规则

**2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？**

答: 脚手架除了为我们创建项目结构，更重要的是给开发者提供一种约束和规范。使团队开发拥有相同的组织结构、模块依赖、工具配置。基础代码等

## 编程题

**1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具**

- 初始化模块，安装 yeoman 依赖 `yarn add -g yo`
- 安装 generator 基类：`yarn add yeoman-generator`
- 创建 generators/app/index.js 为 Generator 的核心入口
- 读取 `templates` 微信小程序模板文件写入指定目录
- 执行 `yarn link` ，根据模板生成项目结构目录
- 在 `templates` 模板中集成 `plop`，可通过 `yarn plop ${name}`生成小程序新页面

- **2、尝试使用 Gulp 完成项目的自动化构建** ( **[先要作的事情](https://gitee.com/lagoufed/fed-e-questions/blob/master/part2/%E4%B8%8B%E8%BD%BD%E5%8C%85%E6%98%AF%E5%87%BA%E9%94%99%E7%9A%84%E8%A7%A3%E5%86%B3%E6%96%B9%E5%BC%8F.md)** )

(html,css,等素材已经放到 code/pages-boilerplate 目录)

- 安装 gulp

```js
yarn add gulp --dev
```

- 安装插件

```js
yarn add gulp-load-plugins --dev // 自动加载插件
yarn add del --dev // 清理文件
yarn add browser-sync --dev // 启动本地服务
yarn add gulp-babel @babel/core @babel/preset-env --dev // babel 转换js
yarn add gulp-sass sass --dev // 转换 sass
yarn add gulp-swig --dev // html 动态数据模板编译输出
yarn add gulp-imagemin --dev // 图片压缩
yarn add gulp-useref --dev // 引用合并
yarn add gulp-if --dev // 判断
yarn add gulp-uglify --dev  // 压缩js
yarn add gulp-clean-css --dev // 压缩css
yarn add gulp-htmlmin --dev // 压缩html
```

- 样式编译
- 脚本编译
- 页面模板编译
- 图片和字体压缩
- 其他处理
- 开发服务器
- 上线处理路径依赖

```js
// 实现这个项目的构建任务
const { src, dest, series, parallel, watch } = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const del = require("del");
const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();
const browserSync = require("browser-sync");
const bs = browserSync.create();

const data = {
  menus: [
    {
      name: "Home",
      icon: "aperture",
      link: "index.html",
    },
    {
      name: "Features",
      link: "features.html",
    },
    {
      name: "About",
      link: "about.html",
    },
    {
      name: "Contact",
      link: "#",
      children: [
        {
          name: "Twitter",
          link: "https://twitter.com/w_zce",
        },
        {
          name: "About",
          link: "https://weibo.com/zceme",
        },
        {
          name: "divider",
        },
        {
          name: "About",
          link: "https://github.com/zce",
        },
      ],
    },
  ],
  pkg: require("./package.json"),
  date: new Date(),
};

// 样式编译
const style = () => {
  return src("src/assets/styles/*.scss", { base: "src" })
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(dest("temp"));
};
// 脚本编译
const script = () => {
  return src("src/assets/scripts/*.js", { base: "src" })
    .pipe(plugins.babel({ presets: ["@babel/preset-env"] }))
    .pipe(dest("temp"));
};
// 页面模版数据编译
const page = () => {
  return src("src/*.html", { base: "src" })
    .pipe(plugins.swig({ data }))
    .pipe(dest("temp"));
};
// 图片压缩
const image = () => {
  return src("src/assets/images/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};
// 字体文件
const font = () => {
  return src("src/assets/fonts/**", { base: "src" })
    .pipe(plugins.imagemin())
    .pipe(dest("dist"));
};
// 额外任务
const extra = () => {
  return src("public/**", { base: "public" }).pipe(dest("dist"));
};
// 清理文件
const clean = () => {
  return del(["dist", "temp"]);
};
// 开发服务器
const server = () => {
  watch("src/assets/styles/*.scss", style);
  watch("src/assets/scripts/*.js", script);
  watch("src/*.html", page);
  watch(
    ["src/assets/images/**", "src/assets/fonts/**", "public/**"],
    bs.reload
  );

  bs.init({
    files: "dist/**",
    port: 8000,
    server: {
      baseDir: ["temp", "src", "public"],
      routes: {
        "/node_modules": "node_modules",
      },
    },
  });
};
// 处理路径依赖
const useref = () => {
  return src("temp/*.html", { base: "src" })
    .pipe(plugins.useref({ searchPath: ["dist", "."] }))
    .pipe(plugins.if(/\.js$/, plugins.uglify())) // 压缩js
    .pipe(plugins.if(/\.css$/, plugins.cleanCss())) // 压缩css
    .pipe(
      plugins.if(
        /.html$/,
        plugins.htmlmin({
          removeComments: false, // 清除HTML注释
          collapseWhitespace: true, // 压缩HTML折叠空格
          minifyCSS: true, // 压缩页面CSS
          minifyJS: true, //  压缩页面JS
        })
      )
    )
    .pipe(dest("dist"));
};

const compile = parallel(style, script, page);
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);
const develop = series(compile, server);

module.exports = {
  build,
  develop,
};
```

## 说明：

本次作业中的编程题要求大家完成相应代码后

- 提交一个项目说明文档，要求思路流程清晰。
- 或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
- 说明文档和代码统一提交至作业仓库。
