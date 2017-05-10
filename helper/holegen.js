
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

_getKazaHoles:function(operation){
  const paths = JSON.parse('[[{"X":53297,"Y":-74756,"data":{"parent":["ebdd2349-0ecf-4980-892a-16068b33c591"]}},{"X":-13923,"Y":-74756,"data":{"parent":["ebdd2349-0ecf-4980-892a-16068b33c591"]}},{"X":-13903,"Y":-71756,"data":{"parent":["ebdd2349-0ecf-4980-892a-16068b33c591"]}},{"X":50297,"Y":-71756,"data":{"parent":["ebdd2349-0ecf-4980-892a-16068b33c591"]}}],[{"X":53297,"Y":-38718,"data":{"parent":["bd55df47-3d45-4ba3-bcc0-8e8a4ce50a1b"]}},{"X":53297,"Y":-74756,"data":{"parent":["bd55df47-3d45-4ba3-bcc0-8e8a4ce50a1b"]}},{"X":50297,"Y":-71756,"data":{"parent":["bd55df47-3d45-4ba3-bcc0-8e8a4ce50a1b"]}},{"X":50297,"Y":-41718,"data":{"parent":["bd55df47-3d45-4ba3-bcc0-8e8a4ce50a1b"]}}],[{"X":-13913,"Y":-38718,"data":{"parent":["6b0eb408-029c-4236-8a75-cd7249871dfa"]}},{"X":53297,"Y":-38718,"data":{"parent":["6b0eb408-029c-4236-8a75-cd7249871dfa"]}},{"X":50297,"Y":-41718,"data":{"parent":["6b0eb408-029c-4236-8a75-cd7249871dfa"]}},{"X":-10913,"Y":-41718,"data":{"parent":["6b0eb408-029c-4236-8a75-cd7249871dfa"]}}],[{"X":-13913,"Y":-73266,"data":{"parent":["77346c71-4ff0-4837-8046-fc65d749693c"]}},{"X":-13913,"Y":-38718,"data":{"parent":["77346c71-4ff0-4837-8046-fc65d749693c"]}},{"X":-10913,"Y":-41718,"data":{"parent":["77346c71-4ff0-4837-8046-fc65d749693c"]}},{"X":-10913,"Y":-73266,"data":{"parent":["77346c71-4ff0-4837-8046-fc65d749693c"]}}],[{"X":31040,"Y":5403,"data":{"parent":["ad64ef0c-e207-4473-81a1-a8673830022a"]}},{"X":51562,"Y":-5479,"data":{"parent":["ad64ef0c-e207-4473-81a1-a8673830022a"]}},{"X":50156,"Y":-8130,"data":{"parent":["ad64ef0c-e207-4473-81a1-a8673830022a"]}},{"X":31040,"Y":2007,"data":{"parent":["ad64ef0c-e207-4473-81a1-a8673830022a"]}}],[{"X":28050,"Y":-9610,"data":{"parent":["852b2bd7-55cb-40fd-a18d-547873776887"]}},{"X":28050,"Y":14810,"data":{"parent":["852b2bd7-55cb-40fd-a18d-547873776887"]}},{"X":31050,"Y":14810,"data":{"parent":["852b2bd7-55cb-40fd-a18d-547873776887"]}},{"X":31050,"Y":-9610,"data":{"parent":["852b2bd7-55cb-40fd-a18d-547873776887"]}}],[{"X":18750,"Y":22100,"data":{"parent":["33780cc8-03d6-48ac-b99c-255f13474572"]}},{"X":18750,"Y":40010,"data":{"parent":["33780cc8-03d6-48ac-b99c-255f13474572"]}},{"X":21750,"Y":40010,"data":{"parent":["33780cc8-03d6-48ac-b99c-255f13474572"]}},{"X":21750,"Y":19100,"data":{"parent":["33780cc8-03d6-48ac-b99c-255f13474572"]}}],[{"X":-29860,"Y":22100,"data":{"parent":["80fadaf3-a6d1-44a3-a537-9ba98203418a"]}},{"X":18750,"Y":22100,"data":{"parent":["80fadaf3-a6d1-44a3-a537-9ba98203418a"]}},{"X":21750,"Y":19100,"data":{"parent":["80fadaf3-a6d1-44a3-a537-9ba98203418a"]}},{"X":-29860,"Y":19100,"data":{"parent":["80fadaf3-a6d1-44a3-a537-9ba98203418a"]}}],[{"X":-29860,"Y":-18300,"data":{"parent":["c4414e30-7c85-49ff-a106-ab8b7c689e5d"]}},{"X":20260,"Y":-18300,"data":{"parent":["c4414e30-7c85-49ff-a106-ab8b7c689e5d"]}},{"X":20260,"Y":-21300,"data":{"parent":["c4414e30-7c85-49ff-a106-ab8b7c689e5d"]}},{"X":-29860,"Y":-21300,"data":{"parent":["c4414e30-7c85-49ff-a106-ab8b7c689e5d"]}}]]');

  const res ={};
  for(let i in paths)
  {
    res[i] = paths[i];
  }
  return res;
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

getData:function(operation, fromKaza  = false){

  let holes;
  if(fromKaza){
    holes = holegen._getKazaHoles();
  } else{
      holes = holegen._getHoles();
  }
  holegen._appendParrents(holes);
  console.log("HOLES", holes);

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
