
var holes = require("../../helper/index");
var clipperLib = require('../../clipper');


var drawscript = {


chooseColor: function (point){
  if(!point.data || !point.data.parent) return [0,0,0];

  const colorMap ={
    hole:[0,0,255],
    longHole:[0,255,0],
    inHole:[127,127,127],
    ininHole:[127,127,0],
    inininHole:[127,0,127],
  }
  let color = [0,0,0];
  point.data.parent.forEach( elt => {
    if(!colorMap[elt]) return;
    for(let i in colorMap[elt]){
      color[i] = (color[i] + colorMap[elt][i])%256;
    }
  });
  return "rgb("+color[0]+","+color[1]+","+color[2]+")";
},

drawPaths: function (ctx,paths, position) {
  ctx.clearRect(0, 0, 1200, 400);
  for(let i in paths ){
    drawscript.drawPath(ctx, paths[i],position)
  }
},

drawPath:function (ctx, pathToDraw, position) {
    if (!position) {
        position = {
            X: 0,
            Y: 0,
        };
    }

    const path = [];
    if (pathToDraw.length === 0) return;
    for (const i in pathToDraw) {
        path.push({
            X: pathToDraw[i].X + position.X,
            Y: pathToDraw[i].Y + position.Y,
            data: pathToDraw[i].data
        });
    }
// Draws the inner of the path
    const pathFill = new Path2D();
    for (let i = 0; i < path.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = drawscript.chooseColor(path[i]);
        ctx.moveTo(path[i].X, path[i].Y);
        ctx.lineTo(path[(i+1)%path.length].X, path[(i+1)%path.length].Y);
        ctx.stroke();
        ctx.closePath();

    }

    // pathFill.lineTo(path[0].X, path[0].Y);

  // Draws the dots:
  for (let i = 0; i < path.length; i++) {
      ctx.strokeStyle = drawscript.chooseColor(path[i]);
      ctx.fillStyle = drawscript.chooseColor(path[i]);
      ctx.fillRect(path[i].X, path[i].Y, 4, 4);
  }

},

checkTest:function ( tests,index,ctxIn,ctxOut){
  const test = tests.tests[index];
    drawscript.drawPaths(ctxIn,test.subj.concat(test.clip));
  let res = holes.getTestResult(test,true);
    drawscript.drawPaths(ctxOut,res);

    ctxIn.font = "30px Arial";
    ctxIn.fillText("INDEX: "+index,10,50);
},
// console.log("LA ");

draw:function (){
    var canvas1 = document.getElementById("canvas1");
    var ctx1= canvas1.getContext('2d');
    var canvas2 = document.getElementById("canvas2");
    var ctx2= canvas2.getContext('2d');

    const pathsP = JSON.parse('[[[{"X":19551,"Y":-18159,"data":{"parent":["5ab52e45-7b5b-44b5-b568-17c35d630ee7"]}},{"X":26149,"Y":-28290,"data":{"parent":["5ab52e45-7b5b-44b5-b568-17c35d630ee7"]}},{"X":23636,"Y":-29927,"data":{"parent":["5ab52e45-7b5b-44b5-b568-17c35d630ee7"]}},{"X":16261,"Y":-18605,"data":{"parent":["5ab52e45-7b5b-44b5-b568-17c35d630ee7"]}}]],[[{"X":10558,"Y":-16369,"data":{"parent":["9d48c694-7bd0-484c-8501-903f1fbcc350"]}},{"X":10276,"Y":-3477,"data":{"parent":["9d48c694-7bd0-484c-8501-903f1fbcc350"]}},{"X":13276,"Y":-3411,"data":{"parent":["9d48c694-7bd0-484c-8501-903f1fbcc350"]}},{"X":13550,"Y":-15964,"data":{"parent":["9d48c694-7bd0-484c-8501-903f1fbcc350"]}}]],[[{"X":65347,"Y":-60094,"data":{"parent":["d65eb31e-5db2-4fb6-9d2f-1f312a2dd89f"]}},{"X":75357,"Y":-70275,"data":{"parent":["d65eb31e-5db2-4fb6-9d2f-1f312a2dd89f"]}},{"X":73217,"Y":-72378,"data":{"parent":["d65eb31e-5db2-4fb6-9d2f-1f312a2dd89f"]}},{"X":62933,"Y":-61918,"data":{"parent":["d65eb31e-5db2-4fb6-9d2f-1f312a2dd89f"]}}]],[[{"X":40923,"Y":-59865,"data":{"parent":["e5b7d83f-de03-4bf9-b059-82e51cabeeda"]}},{"X":33436,"Y":-63692,"data":{"parent":["e5b7d83f-de03-4bf9-b059-82e51cabeeda"]}},{"X":32071,"Y":-61021,"data":{"parent":["e5b7d83f-de03-4bf9-b059-82e51cabeeda"]}},{"X":39087,"Y":-57434,"data":{"parent":["e5b7d83f-de03-4bf9-b059-82e51cabeeda"]}}]],[[{"X":58820,"Y":-61291,"data":{"parent":["a4a6b823-de77-42f6-9ff2-77e94568bba3"]}},{"X":48053,"Y":-47044,"data":{"parent":["a4a6b823-de77-42f6-9ff2-77e94568bba3"]}},{"X":50446,"Y":-45235,"data":{"parent":["a4a6b823-de77-42f6-9ff2-77e94568bba3"]}},{"X":61213,"Y":-59482,"data":{"parent":["a4a6b823-de77-42f6-9ff2-77e94568bba3"]}}]],[[{"X":21615,"Y":-51083,"data":{"parent":["833514dd-e3a3-42d0-9fd2-66094e56b41f"]}},{"X":14445,"Y":-37492,"data":{"parent":["833514dd-e3a3-42d0-9fd2-66094e56b41f"]}},{"X":17098,"Y":-36092,"data":{"parent":["833514dd-e3a3-42d0-9fd2-66094e56b41f"]}},{"X":24268,"Y":-49683,"data":{"parent":["833514dd-e3a3-42d0-9fd2-66094e56b41f"]}}]],[[{"X":16728,"Y":-57031,"data":{"parent":["4f10e46b-4684-487f-9342-49f0f24e0858"]}},{"X":29071,"Y":-70693,"data":{"parent":["4f10e46b-4684-487f-9342-49f0f24e0858"]}},{"X":26845,"Y":-72704,"data":{"parent":["4f10e46b-4684-487f-9342-49f0f24e0858"]}},{"X":13990,"Y":-58475,"data":{"parent":["4f10e46b-4684-487f-9342-49f0f24e0858"]}}]],[[{"X":-1443,"Y":-58041,"data":{"parent":["356b8694-b843-4327-8876-2984de258af4"]}},{"X":-19967,"Y":-63758,"data":{"parent":["356b8694-b843-4327-8876-2984de258af4"]}},{"X":-20852,"Y":-60892,"data":{"parent":["356b8694-b843-4327-8876-2984de258af4"]}},{"X":-2646,"Y":-55273,"data":{"parent":["356b8694-b843-4327-8876-2984de258af4"]}}]],[[{"X":-5020,"Y":-35204,"data":{"parent":["deffb1c7-baed-46d6-a6d8-bf5318ec0c64"]}},{"X":-27080,"Y":-35204,"data":{"parent":["deffb1c7-baed-46d6-a6d8-bf5318ec0c64"]}},{"X":-27080,"Y":-32204,"data":{"parent":["deffb1c7-baed-46d6-a6d8-bf5318ec0c64"]}},{"X":-5020,"Y":-32204,"data":{"parent":["deffb1c7-baed-46d6-a6d8-bf5318ec0c64"]}}]],[[{"X":67302,"Y":-36164,"data":{"parent":["8d9dd597-d427-4349-81ba-382b4fab7588"]}},{"X":88007,"Y":-32061,"data":{"parent":["8d9dd597-d427-4349-81ba-382b4fab7588"]}},{"X":88590,"Y":-35003,"data":{"parent":["8d9dd597-d427-4349-81ba-382b4fab7588"]}},{"X":67885,"Y":-39107,"data":{"parent":["8d9dd597-d427-4349-81ba-382b4fab7588"]}}]],[[{"X":45402,"Y":-17123,"data":{"parent":["11994a55-38a2-4573-9c75-b0a52005db22"]}},{"X":49965,"Y":3502,"data":{"parent":["11994a55-38a2-4573-9c75-b0a52005db22"]}},{"X":52895,"Y":2854,"data":{"parent":["11994a55-38a2-4573-9c75-b0a52005db22"]}},{"X":48331,"Y":-17772,"data":{"parent":["11994a55-38a2-4573-9c75-b0a52005db22"]}}]],[[{"X":1583,"Y":-65032,"data":{"parent":["97cd834a-c1c5-44be-ae13-e25985de7eb5"]}},{"X":-5030,"Y":-49813,"data":{"parent":["97cd834a-c1c5-44be-ae13-e25985de7eb5"]}},{"X":-2030,"Y":-49190,"data":{"parent":["97cd834a-c1c5-44be-ae13-e25985de7eb5"]}},{"X":3045,"Y":-60869,"data":{"parent":["97cd834a-c1c5-44be-ae13-e25985de7eb5"]}}]],[[{"X":32492,"Y":-48725,"data":{"parent":["526193f5-816d-4881-833b-fafe3b6070ae"]}},{"X":1583,"Y":-65032,"data":{"parent":["526193f5-816d-4881-833b-fafe3b6070ae"]}},{"X":3045,"Y":-60869,"data":{"parent":["526193f5-816d-4881-833b-fafe3b6070ae"]}},{"X":33348,"Y":-44882,"data":{"parent":["526193f5-816d-4881-833b-fafe3b6070ae"]}}]],[[{"X":49910,"Y":-71772,"data":{"parent":["406a3cd0-e517-4be6-b31a-408bef5c6a44"]}},{"X":32492,"Y":-48725,"data":{"parent":["406a3cd0-e517-4be6-b31a-408bef5c6a44"]}},{"X":33348,"Y":-44882,"data":{"parent":["406a3cd0-e517-4be6-b31a-408bef5c6a44"]}},{"X":50495,"Y":-67570,"data":{"parent":["406a3cd0-e517-4be6-b31a-408bef5c6a44"]}}]],[[{"X":71183,"Y":-55695,"data":{"parent":["888a7b11-3bc6-439b-bd3b-d88623170851"]}},{"X":49910,"Y":-71772,"data":{"parent":["888a7b11-3bc6-439b-bd3b-d88623170851"]}},{"X":50495,"Y":-67570,"data":{"parent":["888a7b11-3bc6-439b-bd3b-d88623170851"]}},{"X":67875,"Y":-54435,"data":{"parent":["888a7b11-3bc6-439b-bd3b-d88623170851"]}}]],[[{"X":64368,"Y":-21309,"data":{"parent":["acc16c6a-1634-4b32-a3c6-c2a5aec7cee8"]}},{"X":71183,"Y":-55695,"data":{"parent":["acc16c6a-1634-4b32-a3c6-c2a5aec7cee8"]}},{"X":67875,"Y":-54435,"data":{"parent":["acc16c6a-1634-4b32-a3c6-c2a5aec7cee8"]}},{"X":61806,"Y":-23815,"data":{"parent":["acc16c6a-1634-4b32-a3c6-c2a5aec7cee8"]}}]],[[{"X":30061,"Y":-13719,"data":{"parent":["daf7df54-024d-4399-8c40-a375ce866e6d"]}},{"X":64368,"Y":-21309,"data":{"parent":["daf7df54-024d-4399-8c40-a375ce866e6d"]}},{"X":61806,"Y":-23815,"data":{"parent":["daf7df54-024d-4399-8c40-a375ce866e6d"]}},{"X":29935,"Y":-16764,"data":{"parent":["daf7df54-024d-4399-8c40-a375ce866e6d"]}}]],[[{"X":-5030,"Y":-18470,"data":{"parent":["bf5517e6-5230-4c93-a6a6-9e141e27f541"]}},{"X":30061,"Y":-13719,"data":{"parent":["bf5517e6-5230-4c93-a6a6-9e141e27f541"]}},{"X":29935,"Y":-16764,"data":{"parent":["bf5517e6-5230-4c93-a6a6-9e141e27f541"]}},{"X":-2030,"Y":-21091,"data":{"parent":["bf5517e6-5230-4c93-a6a6-9e141e27f541"]}}]],[[{"X":-5030,"Y":-49813,"data":{"parent":["52ebdcb7-7a18-4e34-ad94-0ea3fe7b5fbd"]}},{"X":-5030,"Y":-18470,"data":{"parent":["52ebdcb7-7a18-4e34-ad94-0ea3fe7b5fbd"]}},{"X":-2030,"Y":-21091,"data":{"parent":["52ebdcb7-7a18-4e34-ad94-0ea3fe7b5fbd"]}},{"X":-2030,"Y":-49190,"data":{"parent":["52ebdcb7-7a18-4e34-ad94-0ea3fe7b5fbd"]}}]],[[{"X":8100,"Y":19300,"data":{"parent":["914e9cae-ae44-4e24-9461-715999d5a989"]}},{"X":-21900,"Y":19300,"data":{"parent":["914e9cae-ae44-4e24-9461-715999d5a989"]}},{"X":-18900,"Y":22300,"data":{"parent":["914e9cae-ae44-4e24-9461-715999d5a989"]}},{"X":5100,"Y":22300,"data":{"parent":["914e9cae-ae44-4e24-9461-715999d5a989"]}}]],[[{"X":8100,"Y":42700,"data":{"parent":["1b1bc69b-cbb5-4211-a5d9-3399f0b26364"]}},{"X":8100,"Y":19300,"data":{"parent":["1b1bc69b-cbb5-4211-a5d9-3399f0b26364"]}},{"X":5100,"Y":22300,"data":{"parent":["1b1bc69b-cbb5-4211-a5d9-3399f0b26364"]}},{"X":5100,"Y":39700,"data":{"parent":["1b1bc69b-cbb5-4211-a5d9-3399f0b26364"]}}]],[[{"X":-21900,"Y":42700,"data":{"parent":["95ff1f4a-91f2-4c3e-ab52-36ab41cf26c0"]}},{"X":8100,"Y":42700,"data":{"parent":["95ff1f4a-91f2-4c3e-ab52-36ab41cf26c0"]}},{"X":5100,"Y":39700,"data":{"parent":["95ff1f4a-91f2-4c3e-ab52-36ab41cf26c0"]}},{"X":-18900,"Y":39700,"data":{"parent":["95ff1f4a-91f2-4c3e-ab52-36ab41cf26c0"]}}]],[[{"X":-21900,"Y":19300,"data":{"parent":["90bdf90b-95c7-464d-826b-085599b712c4"]}},{"X":-21900,"Y":42700,"data":{"parent":["90bdf90b-95c7-464d-826b-085599b712c4"]}},{"X":-18900,"Y":39700,"data":{"parent":["90bdf90b-95c7-464d-826b-085599b712c4"]}},{"X":-18900,"Y":22300,"data":{"parent":["90bdf90b-95c7-464d-826b-085599b712c4"]}}]],[[{"X":41210,"Y":-1600,"data":{"parent":["154c4209-4693-4f7e-8864-24e0fc99688e"]}},{"X":24790,"Y":-1600,"data":{"parent":["154c4209-4693-4f7e-8864-24e0fc99688e"]}},{"X":24790,"Y":1400,"data":{"parent":["154c4209-4693-4f7e-8864-24e0fc99688e"]}},{"X":41210,"Y":1400,"data":{"parent":["154c4209-4693-4f7e-8864-24e0fc99688e"]}}]],[[{"X":21800,"Y":-9410,"data":{"parent":["9d7e502f-d173-4c95-8817-9f0368e5325c"]}},{"X":21800,"Y":15410,"data":{"parent":["9d7e502f-d173-4c95-8817-9f0368e5325c"]}},{"X":24800,"Y":15410,"data":{"parent":["9d7e502f-d173-4c95-8817-9f0368e5325c"]}},{"X":24800,"Y":-9410,"data":{"parent":["9d7e502f-d173-4c95-8817-9f0368e5325c"]}}]],[[{"X":-1300,"Y":14100,"data":{"parent":["7939a8c4-ac93-43bc-b2a7-296a27886439"]}},{"X":17510,"Y":14100,"data":{"parent":["7939a8c4-ac93-43bc-b2a7-296a27886439"]}},{"X":17510,"Y":11100,"data":{"parent":["7939a8c4-ac93-43bc-b2a7-296a27886439"]}},{"X":1700,"Y":11100,"data":{"parent":["7939a8c4-ac93-43bc-b2a7-296a27886439"]}}]],[[{"X":-1300,"Y":-9410,"data":{"parent":["2079b652-4be7-4303-b3aa-b4ec6a8bca72"]}},{"X":-1300,"Y":14100,"data":{"parent":["2079b652-4be7-4303-b3aa-b4ec6a8bca72"]}},{"X":1700,"Y":11100,"data":{"parent":["2079b652-4be7-4303-b3aa-b4ec6a8bca72"]}},{"X":1700,"Y":-9410,"data":{"parent":["2079b652-4be7-4303-b3aa-b4ec6a8bca72"]}}]],[[{"X":-8400,"Y":11900,"data":{"parent":["2dc690ce-59dd-420c-827d-417218176f25"]}},{"X":-8400,"Y":-9410,"data":{"parent":["2dc690ce-59dd-420c-827d-417218176f25"]}},{"X":-11400,"Y":-9410,"data":{"parent":["2dc690ce-59dd-420c-827d-417218176f25"]}},{"X":-11400,"Y":8900,"data":{"parent":["2dc690ce-59dd-420c-827d-417218176f25"]}}]],[[{"X":-32150,"Y":11900,"data":{"parent":["02ded316-bf5b-44d5-85bb-b2345879de38"]}},{"X":-8400,"Y":11900,"data":{"parent":["02ded316-bf5b-44d5-85bb-b2345879de38"]}},{"X":-11400,"Y":8900,"data":{"parent":["02ded316-bf5b-44d5-85bb-b2345879de38"]}},{"X":-29150,"Y":8900,"data":{"parent":["02ded316-bf5b-44d5-85bb-b2345879de38"]}}]],[[{"X":-32150,"Y":-9410,"data":{"parent":["77af0140-bc7d-4f9f-b405-fcfda5c645a3"]}},{"X":-32150,"Y":11900,"data":{"parent":["77af0140-bc7d-4f9f-b405-fcfda5c645a3"]}},{"X":-29150,"Y":8900,"data":{"parent":["77af0140-bc7d-4f9f-b405-fcfda5c645a3"]}},{"X":-29150,"Y":-9410,"data":{"parent":["77af0140-bc7d-4f9f-b405-fcfda5c645a3"]}}]]]');

       let mergeResult = new clipperLib.PolyTree();

        const cpr = new clipperLib.Clipper(clipperLib.Clipper.ioPreserveCollinear);

        const subjectFillType = clipperLib.PolyFillType.pftNonZero;
        let clipFillType = clipperLib.PolyFillType.pftNonZero;

        cpr.Clear();
        for (let i = 0; i < pathsP.length; i++) {
            const path = pathsP[i];
            clipperLib.JS.ScaleUpPaths(path, 1000);
            cpr.AddPaths(path, clipperLib.PolyType.ptClip, true);
        }
        cpr.Execute(clipperLib.ClipType.ctUnion, mergeResult, subjectFillType, clipFillType);

        debugger;

    // const tests= holes.getData(clipperLib.ClipType.ctXor);
    // for(let i in tests.tests){
    //   drawscript.checkTest( tests,i,ctx1,ctx2);
    //   debugger;
    // }


},

};

module.exports = drawscript;
