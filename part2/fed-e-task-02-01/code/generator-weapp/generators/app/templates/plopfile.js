module.exports = (plop) => {
  plop.setGenerator("component", {
    description: "create component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "component name",
        default: "myComponent",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/pages/{{name}}/index.js",
        templateFile: "templates/component.js.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{name}}/index.json",
        templateFile: "templates/component.json.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{name}}/index.wxml",
        templateFile: "templates/component.wxml.hbs",
      },
      {
        type: "add",
        path: "src/pages/{{name}}/index.wxss",
        templateFile: "templates/component.wxss.hbs",
      },
    ],
  });
};
