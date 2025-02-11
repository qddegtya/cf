const babelParser = require("@babel/eslint-parser");

module.exports = {
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      sourceType: "module",
      requireConfigFile: false,
      babelOptions: {
        presets: ["@babel/preset-env"]
      }
    },
  },
  rules: {
    indent: [2, 2],
    quotes: [2, "single"],
    "linebreak-style": [2, "unix"],
    semi: [2, "never"],
    "no-unused-vars": [2, { vars: "all", args: "after-used" }]
  }
};
