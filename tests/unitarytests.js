"use strict";

var expect = require("expect.js");
const holes = require("../compiled-helper/bundle");
const assert = require('assert');
const lodash = require("lodash");
const clipperLib = require("../clipper.js")

console.log("HOLES: ", holes);

function isEqualPtCoord(pt1, pt2) {
  return pt1.X === pt2.X && pt1.Y === pt2.Y;
}

// at this point of the test, ptOut is supposed to have a data
function isEqualPtParent(ptIn, ptOut) {
  if (!ptIn.data) return true;
  if (!ptOut.data) return false;
  return lodash.intersection( ptIn.data.parent, ptOut.data.parent).length > 0;
}

function isOkPoint(pointOut, pathIn) {


  if(!pointOut.data) return true;
  // gets the points with the same coords:
  const matchCoords = pathIn.filter( pt => (pt.X === pointOut.X && pt.Y === pointOut.Y));

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
describe('Clipper', function() {
  describe('executeClipper', function() {

    let i=0;
    holes.getData(clipperLib.ClipType.ctUnion,true).tests.forEach((test) => {

      it('UNION---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test);
          expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
      i++;
    });

    holes.getData(clipperLib.ClipType.ctXor).tests.forEach((test) => {
      it('XOR---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });

    holes.getData(clipperLib.ClipType.ctDifference).tests.forEach((test) => {
      it('DIFF---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });

    holes.getData(clipperLib.ClipType.ctIntersection).tests.forEach((test) => {
      it('INTER---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });
  });

  describe('executeClipper- POLY TREE', function() {
/*
    holes.getData(clipperLib.ClipType.ctUnion,true).tests.forEach((test) => {
      it('UNION---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test,true);
          expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });

    holes.getData(clipperLib.ClipType.ctXor).tests.forEach((test) => {
      it('XOR---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test,true);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });

    holes.getData(clipperLib.ClipType.ctDifference).tests.forEach((test) => {
      it('DIFF---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test,true);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });

    holes.getData(clipperLib.ClipType.ctIntersection).tests.forEach((test) => {
      it('INTER---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test,true);
        expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
    });*/
  });

});
