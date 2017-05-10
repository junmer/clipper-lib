require("babel-polyfill");
const holegen = require("./holegen.js");

module.exports =  {
  getData: holegen.getData,
  getTestResult: holegen.getTestResult,
};


// regexp clipper
/*
  ([a-zA-Z\.\[\]1-9]+\.)(data)( = )([a-zA-Z\.\[\]1-9]+\.data)
  $1_data = $4


*/
