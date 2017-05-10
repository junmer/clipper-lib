
var clipperLib = require("../clipper.js");

var holegen = {

 executeClipper:function(pathsSubj, pathsClip, operation,polyTree = false) {
  if (!pathsSubj && !pathsClip) {
    return;
  }
  const options = {
    clipType: operation,
    subjectFill: clipperLib.PolyFillType.pftNonZero,
    clipFill: clipperLib.PolyFillType.pftNonZero
  }

  // settup and execute clipper
  const cpr = new clipperLib.Clipper();
  cpr.AddPaths(pathsSubj, clipperLib.PolyType.ptSubject, true);
  if (pathsClip) {
    cpr.AddPaths(pathsClip, clipperLib.PolyType.ptClip, true);
  }
  let res;
  if(polyTree){
    res = new clipperLib.PolyTree();
  }else {
    res = new clipperLib.Paths();
  }
  cpr.Execute(options.clipType, res, options.subjectFill, options.clipFill);

  if(!polyTree) {return holegen.simplifyPaths(res) ;}
  return holegen.simplifyPaths(clipperLib.Clipper.PolyTreeToPaths(res));
},

simplifyPaths:function(paths){
  return clipperLib.Clipper.SimplifyPolygons(paths, clipperLib.PolyFillType.pftNonZero);
},

getTestResult:function(test, polyTree = false){

  return holegen.executeClipper(test.subj, test.clip, test.operation, polyTree);
},

 _getHoles:function() {
  return {
    hole: [{
      X: 0,
      Y: 0
    }, {
      X: 100,
      Y: 0
    }, {
      X: 100,
      Y: 100
    }, {
      X: 0,
      Y: 100
    }],
    longHole: [{
      X: 0,
      Y: 0
    }, {
      X: 150,
      Y: 0
    }, {
      X: 150,
      Y: 50
    }, {
      X: 0,
      Y: 50
    }],
    inHole: [{
      X: 10,
      Y: 10
    }, {
      X: 90,
      Y: 10
    }, {
      X: 90,
      Y: 90
    }, {
      X: 10,
      Y: 90
    }],
    ininHole: [{
      X: 20,
      Y: 20
    }, {
      X: 80,
      Y: 20
    }, {
      X: 80,
      Y: 80
    }, {
      X: 20,
      Y: 80
    }],
    inininHole: [{
      X: 30,
      Y: 30
    }, {
      X: 70,
      Y: 30
    }, {
      X: 70,
      Y: 70
    }, {
      X: 30,
      Y: 70
    }],
    outHole: [{
      X: -100,
      Y: -100
    }, {
      X: -50,
      Y: -100
    }, {
      X: -50,
      Y: -50
    }, {
      X: -100,
      Y: -50
    }]
  };
},


_getCombinations:function(holes,operation) {
  const res = [];
  let index = 0;
  const holeArray = Object.values(holes);

  for (let i =0; i< holeArray.length-1;i++ ) {
    let subj = [holeArray[i]];
    let clip = [];
    for (let j =i+1; j< holeArray.length;j++ ) {
      clip.push(holeArray[j]);
      res.push({subj,clip:JSON.parse(JSON.stringify(clip)), operation, index});
      index+=1;
    }
  }
  return res;
},


 _appendParrents:function(holes) {
  Object.keys(holes).forEach(key =>{
    holegen._appendParrent( holes[key], key );
  });
},

 _appendParrent:function(path,parentname) {
  for (let i in path) {
    path[i].data = {
      parent: [parentname]
    };
  }
},

getData:function(operation){
  const holes = holegen._getHoles();
  holegen._appendParrents(holes);

  const concatHoles = [];
  for(let i in holes){
    concatHoles.push( ...holes[i] );
  }
  let tests = holegen._getCombinations(holes,operation);
  // tests= [tests[0]];
  return {holes,concatHoles,tests};

},

};
module.exports = holegen;
