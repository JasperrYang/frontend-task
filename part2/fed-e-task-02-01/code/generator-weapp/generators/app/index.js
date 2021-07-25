const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "project name",
        default: this.appname,
      },
    ]).then((answer) => {
      this.answer = answer;
      console.log(answer);
    });
  }
  writing() {
    const templates = [
      "project.config.json",
      "src/pages/home/index.js",
      "src/pages/home/index.json",
      "src/pages/home/index.wxml",
      "src/pages/home/index.wxss",
      "src/utils/util.js",
      "src/app.js",
      "src/app.json",
      "src/app.wxss",
      "src/project.config.json",
      "src/sitemap.json",
      "templates/component.js.hbs",
      "templates/component.json.hbs",
      "templates/component.wxml.hbs",
      "templates/component.wxss.hbs",
      "plopfile.js",
      "README.md",
      "package.json",
    ];
    templates.forEach((item) => {
      this.fs.copyTpl(
        this.templatePath(item),
        this.destinationPath(item),
        this.answer
      );
    });
  }
};
