require("babel-polyfill");
const holegen = require("./holegen.js");

module.exports =  {
  getData: holegen.getData,
  getTestResult: holegen.getTestResult,
};
