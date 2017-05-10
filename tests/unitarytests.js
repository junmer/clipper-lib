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
  const matchPoints = pathIn.filter(pt => isEqualPtCoord(pt, pointOut));
  if (matchPoints.length === 0) return true;
  // there must be a point matching into pathIn <=> there must be data into pt
  if(!matchPoints.filter(pt => isEqualPtParent(pt, pointOut)).length > 0) {
    console.log("point", pointOut);
    for(let i = 0;i < pathIn.length;i++){
      console.log("path", pathIn[i]);
    }
  }
  return matchPoints.filter(pt => isEqualPtParent(pt, pointOut)).length > 0;
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

    holes.getData(clipperLib.ClipType.ctUnion).tests.forEach((test) => {
      it('UNION---copy data to result, test index= '+ test.index, function() {
        let res = holes.getTestResult(test);
          expect(isOkResult(test.subj.concat(test.clip), res)).to.be.equal(true);
      });
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

    holes.getData(clipperLib.ClipType.ctUnion).tests.forEach((test) => {
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
    });
  });

});
