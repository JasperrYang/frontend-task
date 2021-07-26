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
