"use strict";

var expect = require("expect.js");
const holes = require("../compiled-helper/bundle");
const assert = require('assert');
const lodash = require("lodash");
const clipperLib = require("../clipper.js")

console.log("HOLES: ", holes);

function isOkPoint(pointOut, pathIn) {

  if(!pointOut.data){
    console.log("NO DATA point", pointOut);
    return false;
  }

  // gets the points with the same coords:
  const matchCoords = pathIn.filter( pt => (pt.X === pointOut.X && pt.Y === pointOut.Y));
  if(matchCoords.length === 0) {
      return true;
  }

  // gets the parent points :
  const parents = matchCoords.filter( pt => lodash.intersection(pt.data.parent, pointOut.data.parent).length > 0);

  if(matchCoords.length > 0 && parents.length === 0){
      console.log("point", pointOut);
      console.log("PARENTS:", parents.length);
      for(let i = 0;i < parents.length;i++){
        console.log(parents[i]);
      }
      console.log("MATCH-COORDS:", matchCoords.length);
      for(let i = 0;i < matchCoords.length;i++){
        console.log(matchCoords[i]);
      }
      return false;
  }
  return true;
}

function isOkResult(pathsIn, pathsOut) {
  const pathIn = [];
  for (let i in pathsIn) {
    pathIn.push(...pathsIn[i]);
  }
  for (let i in pathsOut) {
    for (let j in pathsOut[i]) {
      if (!isOkPoint(pathsOut[i][j], pathIn)) return false;
    }
  }
  return true;
}

function runTest(operation, polyFlag, kazaFlag ){
  holes.getData(operation,kazaFlag).tests.forEach((test) => {
    // if(test.index !== 8) return
    it(getTestName(operation, polyFlag,kazaFlag)+', test index= '+ test.index, function() {
      let res = holes.getTestResult(test,polyFlag);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
    });
  });
}

function getTestName(operation, polyFlag,kazaFlag){
  let res = '';
  switch(operation){
    case clipperLib.ClipType.ctUnion:
      res+= 'UNION ';
      break;
    case clipperLib.ClipType.ctXor:
      res+= 'XOR ';
      break;
    case clipperLib.ClipType.ctIntersection:
      res+= 'Intersection ';
      break;
    case clipperLib.ClipType.ctDifference:
      res+= 'ctDifference ';
      break;
  }
  res+= 'PolyType: ';
  switch (polyFlag) {
    case true:
        res+= 'true';
      break;
    case false:
      res+= 'false';
     break;
  }

  res+= ' DataType: '
  switch (kazaFlag) {
    case true:
        res+= 'From Kaza';
      break;
    case false:
      res+= 'From Tests';
     break;
  }
  return res;
}

function getTests(){
  const operations = [clipperLib.ClipType.ctUnion,clipperLib.ClipType.ctXor, clipperLib.ClipType.ctIntersection,clipperLib.ClipType.ctDifference];
  const polyFlags = [false,true];
  const kazaflags = [false,true];

  // const operations = [clipperLib.ClipType.ctDifference]
  // const polyFlags = [false];
  // const kazaflags = [false];

  const res =[];
  for(let i in kazaflags){
    for(let j in polyFlags){
      for(let k in operations)
        res.push({operation: operations[k], polyFlag: polyFlags[j], kazaFlag: kazaflags[i]});
    }
  }
  return res;
}


describe('Clipper', function() {
  describe('executeClipper', function() {
    getTests().forEach((test) => {
          runTest(test.operation, test.polyFlag, test.kazaFlag );
    });
  });

});
