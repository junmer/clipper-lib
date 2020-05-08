# Clipper 6 Documentation

This is Javascript Clipper 6 documentation. Unfortunately there is no documentation for Javascript Clipper 5. If you need Clipper 5 docs, please download <a href="https://sourceforge.net/projects/polyclipping/files/">C# Clipper 5</a> and check the documentation folder.

If you are migrating from Javascript Clipper 5 to 6, please read the <a href="https://sourceforge.net/p/jsclipper/wiki/migration5to6/">migration guide</a>.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Table of Contents

[TOC]

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Overview

The Javascript Clipper Library performs <a href="#clipperlibcliptype">clipping</a> and <a href="#clipperlibclipperoffsetpaths">offsetting</a> of both lines and polygons.

A number of features set Clipper apart from other clipping libraries:

* it accepts all types of polygons including self-intersecting ones
* it supports multiple polygon filling rules (EvenOdd, NonZero, Positive, Negative)
* it's very fast relative to <a href="http://www.angusj.com/delphi/clipper.php#features">other libraries</a>
* it also performs line and polygon offsetting
* it's <a href="http://www.mpi-inf.mpg.de/~kettner/pub/nonrobust_cgta_06.pdf">numerically robust</a>
* it's free to use in both freeware and commercial applications

**Current Javascript Clipper version:** 6.1.3.2 (C# 6.1.3a)

**Original C# version's Author & copyright:**
Angus Johnson. Copyright © 2010-2014
License, terms and conditions: <a href="http://www.angusj.com/delphi/clipper/documentation/Docs/Overview/License.htm">Boost Software License</a>

**Javascript Clipper's Author & copyright:**
Timo. Copyright © 2012-2014
License, terms and conditions: <a href="http://www.angusj.com/delphi/clipper/documentation/Docs/Overview/License.htm">Boost Software License</a>

Javascript Clipper uses implementation of Tom Wu's <a href="http://www-cs-students.stanford.edu/~tjw/jsbn/">JSBN</a> library, which has <a href="http://www-cs-students.stanford.edu/~tjw/jsbn/LICENSE">BSD</a> license.

<a id="terminology"><b>Terminology:</b></a>

* **Clipping:** commonly refers to the process of removing (cutting away) from a set of 2-dimensional geometric shapes those parts that are outside a rectangular 'clipping' window. This can be achieved by intersecting subject paths (lines and polygons) with the clipping rectangle. In a more general sense, the clipping window need not be rectangular but can be any type of polygon, even multiple polygons. Also, while clipping typically refers to an intersection operation, in this documentation it will refer to any one of the <a href="#clipperlibcliptype">four boolean operations</a> (intersection, union, difference and exclusive-or).
* **Path:** is an ordered sequence of vertices defining a single geometric contour that's either a line (an open path) or a polygon (a closed path).
* **Contour:** synonymous with path.
* **Line:** or polyline is an open path containing 2 or more vertices.
* **Polygon:** in a general sense is a two-dimensional region that's bounded by an outer closed path and containing zero to many 'holes'. However in this documentation polygon refers to a <a href="#clipperlibpath">Path</a> that's known to be closed.
* **Hole:** is a closed region within a polygon that's not part of the polygon. A polygon that forms the outer boundaries of a hole is called a hole polygon.
* **Polygon Filling Rule:** together with a list of paths, the <a href="#clipperlibpolyfilltype">filling rule</a> defines those regions bounded by paths that are inside polygons (ie 'filled' in a graphical display) and those which are outside.

**Distribution package contents:**

The ZIP package contains the Clipper library's source code as minified and unminified. The library was initially written in Delphi Pascal, but was then made available also in C++, C# and Python. The library's source code in each language is about 5000 lines. Javascript implementation is longer, about 6200 lines due to JSBN library and some helper functions.

Demo applications and examples are not included in the distribution package. They can be accessed <a href="http://jsclipper.sourceforge.net/6.1.3.2/">here</a>. The sample applications show how Clipper can be used with **SVG** and **Canvas**.

**Download Link:**

<a href="https://sourceforge.net/projects/jsclipper/files/">SourceForge</a>

**References:**

Read about <a href="http://www.angusj.com/delphi/clipper/documentation/Docs/Overview/_Body.htm">references</a> regarding clipping and offsetting algorithms.

**See also:**
<a href="#clipperlibclipperoffsetpaths">OffsetPaths</a>, <a href="#clipperlibcliptype">ClipType</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Preprocessor defines

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean use_int32
Boolean use_xyz
Boolean use_lines
Boolean use_deprecated
</pre>
####

**use_int32:**
Not implemented in Javascript.

**use_xyz:**
Adds a 'Z' member to <a href="#clipperlibintpoint">IntPoint</a> with only a minor cost to perfomance. For more details see Clipper's <a href="#clipperlibclipperzfillfunction">Clipper.ZFillFunction</a> property. (Disabled by default)

**use_lines:**
Enables open path (line) clipping. If line clipping is disabled, there's generally a very small (ie ~5%) improvement in performance. (Enabled by default)

**use_deprecated:**
Enables code developed with versions of Clipper prior to version 6 to compile without changes. This exposes compatibility code that will be removed in a future update. (Enabled by default)

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var use_xyz = true;
var use_lines = true;
var use_deprecated = true;
</pre>
####

**See also:**
<a href="#clipperlibclipperzfillfunction">Clipper.ZFillFunction</a>, <a href="#clipperlibintpoint">IntPoint</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## ClipperBase

ClipperBase is an abstract base class for <a href="#clipper">Clipper</a>. A ClipperBase object should not be instantiated directly.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- ClipperBase methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperBase.AddPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean AddPath(<a href="#clipperlibpath">Path</a> pg, <a href="#clipperlibpolytype">PolyType</a> polyType, Boolean closed);
</pre>
####


Any number of subject and clip paths can be added to a clipping task, either individually via the AddPath() method, or as groups via the AddPaths() method, or even using both methods.

'Subject' paths may be either open (lines) or closed (polygons) or even a mixture of both, but 'clipping' paths must always be closed. Clipper allows polygons to clip both lines and other polygons, but doesn't allow lines to clip either lines or polygons.

With closed paths, <a href="#clipperlibclipperorientation">orientation</a> should conform with the <a href="#clipperlibpolyfilltype">filling rule</a> that will be passed via Clipper's <a href="#clipperlibclipperexecute">Execute</a> method.

Path Coordinate range:
Path coordinates must be between ± 4503599627370495 (sqrt(2^106 -1)/2), otherwise a range error will be thrown when attempting to add the path to the Clipper object. If coordinates can be kept between ± 47453132 (sqrt(2^53 -1)/2), an increase in performance (approx. 40-50%) over the larger range can be achieved by avoiding large integer math.

Return Value:
The function will return false if the path is empty or almost empty. A path is almost empty when:

* it has less than 2 vertices.
* it has 2 vertices but is not an open path
* the vertices are all co-linear and it is not an open path

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
var path = [{"X":10,"Y":10},{"X":110,"Y":10},{"X":110,"Y":110},{"X":10,"Y":110}];
cpr.AddPath(path, ClipperLib.PolyType.ptSubject, true);
</pre>
####

**See also:**
<a href="#example">Example</a>, <a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperbaseaddpaths">AddPaths</a>, <a href="#clipperlibclipperorientation">Orientation</a>, <a href="#preprocessor-defines">Defines</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>, <a href="#clipperlibpolytype">PolyType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperBase.AddPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean AddPaths(<a href="#clipperlibpaths">Paths</a> ppg, <a href="#clipperlibpolytype">PolyType</a> polyType, Boolean closed);
</pre>
####

Same functionality as in <a href="#clipperbaseaddpath">AddPath()</a>, but the parameter is <a href="#clipperlibpaths">Paths</a>.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
             [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];;
cpr.AddPaths(paths, ClipperLib.PolyType.ptSubject, true);
</pre>
####

**See also:**
<a href="#example">Example</a>, <a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperbaseaddpath">AddPath</a>, <a href="#clipperlibclipperorientation">Orientation</a>, <a href="#preprocessor-defines">Defines</a>, <a href="#clipperlibpaths">Paths</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>, <a href="#clipperlibpolytype">PolyType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperBase.Clear()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void Clear();
</pre>
####

The Clear method removes any existing subject and clip polygons allowing the Clipper object to be reused for clipping operations on different polygon sets.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
cpr.Clear();
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Clipper

The Clipper class encapsulates <a href="#clipperlibcliptype">boolean operations</a> on polygons (intersection, union, difference and XOR), which is also called <a href="#terminology">polygon clipping</a>.

Input polygons, both subject and clip sets, are passed to a Clipper object by its <a href="#clipperbaseaddpath">AddPath</a> and <a href="#clipperbaseaddpaths">AddPaths</a> methods, and the clipping operation is performed by calling its <a href="#clipperlibclipperexecute">Execute</a> method. Multiple boolean operations can be performed on the same input polygon sets by repeat calls to Execute.

**See also:**

<a href="#overview">Overview</a>, <a href="#clipperlibcliptype">ClipType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- Clipper methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Clipper Clipper(<a href="#initoptions">InitOptions</a> initOptions = 0);
</pre>
####

The Clipper constructor creates an instance of the Clipper class. One or more <a href="#initoptions">InitOptions</a> may be passed as a parameter to set the corresponding properties. (These properties can still be set or reset after construction.)

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
// or
var cpr = new ClipperLib.Clipper(ClipperLib.Clipper.ioStrictlySimple | ClipperLib.Clipper.ioPreserveCollinear);
// or
var cpr = new ClipperLib.Clipper(2 | 4);
</pre>
####

**See also:**
<a href="#clipperlibclipperpreservecollinear">PreserveCollinear</a>, <a href="#clipperlibclipperreversesolution">ReverseSolution</a>, <a href="#clipperlibclipperstrictlysimple">StrictlySimple</a>, <a href="#initoptions">InitOptions</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.Area()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number Area(<a href="#clipperlibpath">Path</a> poly)
</pre>
####

This function returns the area of the supplied polygon. (It's assumed that the path will be closed.) Depending on <a href="#clipperlibclipperorientation">orientation</a>, this value may be positive or negative. If Orientation is true, then the area will be positive and conversely, if Orientation is false, then the area will be negative.

<b>**Usage:**</b>

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var area = ClipperLib.Clipper.Area(polygon);
</pre>
####

** See also:**
<a href="#clipperlibclipperorientation">Orientation</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.CleanPolygon()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpath">Path</a> CleanPolygon(<a href="#clipperlibpath">Path</a> path, Number distance)
</pre>
####

This function is needed to prevent distortion that is caused by too near vertices and/or micro-self-interserctions.

Removes vertices:

* that join co-linear edges, or join edges that are almost co-linear (such that if the vertex was moved no more than the specified distance the edges would be co-linear)

* that are within the specified distance of an adjacent vertex

* that are within the specified distance of a semi-adjacent vertex together with their out-lying vertices

Vertices are semi-adjacent when they are separated by a single (out-lying) vertex.

The distance parameter's default value is approximately √2 so that a vertex will be removed when adjacent or semi-adjacent vertices having their corresponding X and Y coordinates differing by no more than 1 unit. (If the egdes are semi-adjacent the out-lying vertex will be removed too.)

Timo: According to tests, the most proper distance value to remove artifacts before offsetting is 0.1 * scale.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/clean1.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/clean2.png"/>

<b>**Usage:**</b>

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{"X":10,"Y":10},{"X":11,"Y":11},{"X":110,"Y":10},{"X":110,"Y":110},
{"X":10,"Y":110}];
var cleaned_path = ClipperLib.Clipper.CleanPolygon(path, 1.1);
// point {"X":11,"Y":11} is now removed
</pre>
####

**See also:**
<a href="#clipperlibclippercleanpolygons">CleanPolygons</a>, <a href="#clipperlibclippersimplifypolygon">SimplifyPolygon</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.CleanPolygons()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> CleanPolygons(<a href="#clipperlibpaths">Paths</a> polys, Number distance)
</pre>
####

Same functionality as in CleanPolygon, but the parameter is of type Paths.

According to tests, the most proper distance value to remove artifacts before offsetting is 0.1 * scale

Read more in <a href="#clipperlibclippercleanpolygon">CleanPolygon</a>.

<b>**Usage:**</b>

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:11,Y:11},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
             [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var cleaned_paths = ClipperLib.Clipper.CleanPolygons(paths, 1.1);
// point {"X":11,"Y":11} is removed
</pre>
####

**See also:**
<a href="#clipperlibclippercleanpolygon">CleanPolygon</a>, <a href="#clipperlibclippersimplifypolygons">SimplifyPolygons</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ClosedPathsFromPolyTree()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> ClosedPathsFromPolyTree(<a href="#clipperlibpolytree">PolyTree</a> polytree)
</pre>
####

This function filters out open paths from the PolyTree structure and returns only closed paths in a Paths structure.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// ... polytree is populated automatically by Execute()
var polygons = ClipperLib.Clipper.ClosedPathsFromPolyTree(polytree);
</pre>
####

**See also:**
<a href="#clipperlibpolytree">PolyTree</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.Execute()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean Execute(<a href="#clipperlibcliptype">ClipType</a> clipType,
  <a href="#clipperlibpaths">Paths</a> solution,
  <a href="#clipperlibpolyfilltype">PolyFillType</a> subjFillType,
  <a href="#clipperlibpolyfilltype">PolyFillType</a> clipFillType);

Boolean Execute(<a href="#clipperlibcliptype">ClipType</a> clipType,
  <a href="#clipperlibpolytree">PolyTree</a> solution,
  <a href="#clipperlibpolyfilltype">PolyFillType</a> subjFillType,
  <a href="#clipperlibpolyfilltype">PolyFillType</a> clipFillType);
</pre>
####

Once subject and clip paths have been assigned (via <a href="#clipperbaseaddpath">AddPath</a> and/or <a href="#clipperbaseaddpaths">AddPaths</a>), Execute can then perform the clipping operation (intersection, union, difference or XOR) specified by the <a href="#clipperlibcliptype">clipType</a> parameter.

The solution parameter can be either a <a href="#clipperlibpaths">Paths</a> or <a href="#clipperlibpolytree">PolyTree</a> structure. The Paths structure is simpler and faster (roughly 10%) than the PolyTree stucture. PolyTree holds information of parent-child relationchips of paths and also whether they are open or closed.

When a PolyTree object is used in a clipping operation on open paths, two ancilliary functions have been provided to quickly separate out open and closed paths from the solution - <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a> and <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a>. <a href="#clipperlibclipperpolytreetopaths">PolyTreeToPaths</a> is also available to convert path data to a Paths structure (irrespective of whether they're open or closed).

There are several things to note about the solution paths returned:

* they aren't in any specific order
* they should never overlap or be self-intersecting (but see notes on <a href="#rounding">rounding</a>)
* holes will be oriented opposite outer polygons
* the solution fill type can be considered either EvenOdd or NonZero since it will comply with either filling rule
* polygons may rarely share a common edge (though this is now very rare as of version 6)

The subjFillType and clipFillType parameters define the polygon <a href="#clipperlibpolyfilltype">fill rule</a> to be applied to the polygons (ie closed paths) in the subject and clip paths respectively. (It's usual though obviously not essential that both sets of polygons use the same fill rule.)

Execute can be called multiple times without reassigning subject and clip polygons (ie when different clipping operations are required on the same polygon sets).

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/common_edges.png"/>

**Usage:**

<pre id="example" style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
function DrawPolygons(paths, color)
{/* ... */}

function Main(args)
{
  var subj = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
                  [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
  var clip = [[{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}],
                  [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]];
  DrawPolygons(subj, 0x8033FFFF);
  DrawPolygons(clip, 0x80FFFF33);

  var solution = new ClipperLib.Paths();
  var c = new ClipperLib.Clipper();
  c.AddPaths(subj, ClipperLib.PolyType.ptSubject, true);
  c.AddPaths(clip, ClipperLib.PolyType.ptClip, true);
  c.Execute(ClipperLib.ClipType.ctIntersection, solution);

  DrawPolygons(solution, 0x40808080);
}
Main();
</pre>
####

**See also:**
<a href="#rounding">Rounding</a>, <a href="#clipperbaseaddpath">ClipperBase.AddPath</a>, <a href="#clipperbaseaddpaths">ClipperBase.AddPaths</a>, <a href="#clipperlibpolynodeisopen">PolyNode.IsOpen</a>, <a href="#clipperlibpolytree">PolyTree</a>, <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a>, <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a>, <a href="#clipperlibclipperpolytreetopaths">PolyTreeToPaths</a>, <a href="#clipperlibcliptype">ClipType</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpaths">Paths</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.GetBounds()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibintrect">IntRect</a> GetBounds(<a href="#clipperlibpaths">Paths</a> paths);
</pre>
####

This method returns the axis-aligned bounding rectangle of paths.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{"X":10,"Y":10},{"X":110,"Y":10},{"X":110,"Y":110},{"X":10,"Y":110}]];
var bounds = ClipperLib.Clipper.GetBounds(paths);
// bounds is {"left":10,"top":10,"right":110,"bottom":110}
</pre>
####

**See also:**
<a href="#example">Example</a>, <a href="#clipperlibintrect">IntRect</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.MinkowskiDiff()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> MinkowskiDiff(<a href="#clipperlibpath">Path</a> poly, <a href="#clipperlibpath">Path</a> path, Boolean isClosed)
</pre>
####

Minkowski Difference is performed by subtracting each point in a polygon from the set of points in an open or closed path. A key feature of Minkowski Difference is that when it's applied to two polygons, the resulting polygon will contain the coordinate space origin whenever the two polygons touch or overlap. (This function is often used to determine when polygons collide.)

**See also:**
<a href="#clipperlibclipperminkowskisum">MinkowskiSum</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.MinkowskiSum()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> MinkowskiSum(<a href="#clipperlibpath">Path</a> pattern, <a href="#clipperlibpath">Path</a> path, Boolean pathIsClosed)
<a href="#clipperlibpaths">Paths</a> MinkowskiSum(<a href="#clipperlibpath">Path</a> pattern, <a href="#clipperlibpaths">Paths</a> paths, <a href="#clipperlibpolyfilltype">PolyFillType</a> pathFillType, Boolean pathIsClosed)
</pre>
####

Minkowski Addition is performed by adding each point in a polygon 'pattern' to the set of points in an open or closed path. The resulting polygon (or polygons) defines the region that the 'pattern' would pass over in moving from the beginning to the end of the 'path'.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// Star shape ...
var path = [{"X":89.85,"Y":355.85},{"X":131.72,"Y":227.13},{"X":22.1,"Y":147.57},{"X":157.6,"Y":147.57},{"X":199.47,"Y":18.85},{"X":241.34,"Y":147.57},{"X":376.84,"Y":147.57},{"X":267.22,"Y":227.13},{"X":309.09,"Y":355.85},{"X":199.47,"Y":276.29}];
// Diagonal brush shape ...
var shape = [{"X":4,"Y":-6},{"X":6,"Y":-6},{"X":-4,"Y":6},{"X":-6,"Y":6}];
var solution = ClipperLib.Clipper.MinkowskiSum(shape, path, true);
</pre>
####

**See also:**
<a href="#clipperlibclipperminkowskidiff">MinkowskiDiff</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.OffsetPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> OffsetPaths(<a href="#clipperlibpaths">Paths</a> polys, Number delta, <a href="#clipperlibjointype">JoinType</a> jointype = JoinType.jtSquare, <a href="#clipperlibendtype">EndType</a> endtype = EndType.etClosed, Number limit)
</pre>
####

**Deprecated.** (See <a href="#clipperlibclipperoffset">ClipperOffset</a>.)

This function offsets the 'polys' parameter by the 'delta' amount. 'polys' may be open or closed paths. With closed paths (polygons), positive delta values 'expand' outer contours and 'shrink' inner 'hole' contours. Negative deltas do the reverse. With open paths (lines), the sign of the delta value is ignored since it's not possible to 'shrink' open paths.

Edge joins may be one of three <a href="#clipperlibclipperoffsetjointype">jointypes</a> - jtMiter, jtSquare or jtRound. (See the image below for examples.)

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/jointypes.png"/>

The meaning and use of the limit parameter depends on jointype:

* jtMiter: limit sets the maximum distance in multiples of delta that vertices can be offset from their original positions before squaring is applied. **The default value is 2** (ie twice delta) which is also the smallest allowed value. If the angle is acute enough to require squaring, then squaring will occur at 1 times delta. If offsetting was allowed without any limits (ie without squaring), then offsetting at very acute angles would produce unacceptably long 'spikes'.

* jtRound: limit sets the maximum distance that rounded joins can deviate from their true arcs (since it would require an infinite number of vertices to perfectly represent an arc). **The default limit is 0.25 units** though realistically precision can never be better than 0.5 since arc coordinates will still be rounded to integer values. When offsetting polygons with very large coordinate values (typically as a result of scaling), it's advisable to increase limit to maintain consistent precisions at all joins because the maximum number of vertices allowed in any arc is 222. (This hard coded upper limit has been chosen because the imprecision in a circle constructed with 222 vertices will be only 1/10000th its radius and, not only is creating very large numbers of arc vertices computationally expensive, it can cause out-of-memory problems.)

* jtSquare: The limit parameter is ignored since squaring will be applied uniformally at 1 times delta.

Self-intersections in closed paths must be removed before the paths are passed to OffsetPaths.


**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{"X":224,"Y":146},{"X":224,"Y":213},{"X":201,"Y":191},{"X":179,"Y":235},{"X":134,"Y":191},{"X":179,"Y":168},{"X":157,"Y":146}]];
var offset_paths = ClipperLib.Clipper.OffsetPaths(paths, 10, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosed, 0.25);
</pre>
####

**See also:**
<a href="#clipperlibclipperoffset">ClipperOffset</a>, <a href="#clipperlibclipperoffsetjointype">ClipperOffset.JoinType</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.OpenPathsFromPolyTree()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> OpenPathsFromPolyTree(<a href="#clipperlibpolytree">PolyTree</a> polytree)
</pre>
####

This function filters out closed paths from the PolyTree structure and returns only open paths in a Paths structure.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// ... polytree is populated automatically by Execute()
var lines = ClipperLib.Clipper.OpenPathsFromPolyTree(polytree);
</pre>
####

**See also:**
<a href="#clipperlibpolytree">PolyTree</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.Orientation()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean Orientation(<a href="#clipperlibpath">Path</a> poly)
</pre>
####

Returns true, if polygon area is >=0.

Orientation is only important to closed paths. Given that vertices are declared in a specific order, orientation refers to the direction (clockwise or counter-clockwise) that these vertices progress around a closed path.

Orientation is also dependent on axis direction:

* On Y-axis positive upward displays, Orientation will return true if the polygon's orientation is counter-clockwise.

* On Y-axis positive downward displays, Orientation will return true if the polygon's orientation is clockwise.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/orientation.png"/>

**Notes:**

* Self-intersecting polygons have indeterminate orientations in which case this function won't return a meaningful value.
* The majority of 2D graphic display libraries (eg GDI, GDI+, XLib, Cairo, AGG, Graphics32) and even the SVG file format have their coordinate origins at the top-left corner of their respective viewports with their Y axes increasing downward. However, some display libraries (eg Quartz, OpenGL) have their coordinate origins undefined or in the classic bottom-left position with their Y axes increasing upward.
* For Non-Zero filled polygons, the orientation of <a href="#terminology">holes</a> must be opposite that of <a href="#terminology">outer<a> polygons.
* For closed paths (polygons) in the solution returned by Clipper's Execute method, their orientations will always be true for outer polygons and false for hole polygons (unless the <a href="#clipperlibclipperreversesolution">ReverseSolution</a> property has been enabled).

<b>**Usage:**</b>

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var orientation = ClipperLib.Clipper.Orientation(polygon);
</pre>
####

**See also:**
<a href="#clipperlibclipperarea">Area</a>, <a href="#clipperlibclipperreversesolution">Clipper.ReverseSolution</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.PointInPolygon()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number PointInPolygon(<a href="#clipperlibintpoint">IntPoint</a> pt, <a href="#clipperlibpath">Path</a> poly)
</pre>
####

Returns 0 if false, -1 if pt is **on** poly and +1 if pt is **in** poly.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var poly = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var pt = new ClipperLib.IntPoint(50,50);
var inpoly = ClipperLib.Clipper.PointInPolygon(pt, poly);
// inpoly is 1, which means that pt is in polygon
</pre>
####

**See also:**
<a href="#clipperlibintpoint">IntPoint</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.PolyTreeToPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> PolyTreeToPaths(<a href="#clipperlibpolytree">PolyTree</a> polytree)
</pre>
####

This function converts a <a href="#clipperlibpolytree">PolyTree</a> structure into a <a href="#clipperlibpaths">Paths</a> structure (whether they are open or closed). To differentiate open and closed paths, use <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a> or <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a>.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// ... polytree is populated automatically by Execute()
var paths = ClipperLib.Clipper.PolyTreeToPaths(polytree);
</pre>
####

**See also:**
<a href="#clipperlibpolytree">PolyTree</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ReversePath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
// Call Path.reverse().
</pre>
####

Reverses the vertex order (and hence orientation) in a path.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{"X":10,"Y":10},{"X":110,"Y":10},{"X":110,"Y":110},{"X":10,"Y":110}];
path.reverse();
// path is now [[{"X":10,"Y":110},{"X":110,"Y":110},{"X":110,"Y":10},{"X":10,"Y":10}]]
</pre>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ReversePaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ReversePaths(<a href="#clipperlibpaths">Paths</a> p)
</pre>
####

Reverses the vertex order (and hence orientation) in each contained path.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{"X":10,"Y":10},{"X":110,"Y":10},{"X":110,"Y":110},{"X":10,"Y":110}]];
ClipperLib.Clipper.ReversePaths(paths);
// paths is now [[{"X":10,"Y":110},{"X":110,"Y":110},{"X":110,"Y":10},{"X":10,"Y":10}]]
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.SimplifyPolygon()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> SimplifyPolygon(<a href="#clipperlibpath">Path</a> poly, <a href="#clipperlibpolyfilltype">PolyFillType</a> fillType = PolyFillType.pftEvenOdd)
</pre>
####

Removes self-intersections from the supplied polygon (by performing a boolean union operation using the nominated <a href="#clipperlibpolyfilltype">PolyFillType</a>).

Polygons with non-contiguous duplicate vertices (ie 'touching') will be split into two polygons.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/simplify.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/simplify2.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/simplify3.png"/>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// five-pointed star with self-intersections...
var five_pointed_star = [{"X":147,"Y":313},{"X":247,"Y":34},{"X":338,"Y":312},{"X":86,"Y":123},{"X":404,"Y":124}];
var ten_pointed_star = ClipperLib.Clipper.SimplifyPolygon(five_pointed_star, ClipperLib.PolyFillType.pftNonZero);
// ten_pointed_star is a ten-pointed star with no self-intersections
var fifteen_pointed_star = ClipperLib.Clipper.SimplifyPolygon(five_pointed_star, ClipperLib.PolyFillType.pftEvenOdd);
// fifteen_pointed_star is a fifteen-pointed star with no self-intersections
</pre>
####

**See also:**
<a href="#clipperlibclipperstrictlysimple">Clipper.StrictlySimple</a>, <a href="#clipperlibclippercleanpolygon">CleanPolygon</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.SimplifyPolygons()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> SimplifyPolygons(<a href="#clipperlibpaths">Paths</a> polys, <a href="#clipperlibpolyfilltype">PolyFillType</a> fillType = PolyFillType.pftEvenOdd)
</pre>
####

The same functionality as in <a href="#clipperlibclippersimplifypolygon">SimplifyPolygon</a>, but the parameter is of type <a href="#clipperlibpaths">Paths</a>.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
// five-pointed star with self-intersections...
var five_pointed_star = [[{"X":147,"Y":313},{"X":247,"Y":34},{"X":338,"Y":312},{"X":86,"Y":123},{"X":404,"Y":124}]];
var ten_pointed_star = ClipperLib.Clipper.SimplifyPolygons(five_pointed_star, ClipperLib.PolyFillType.pftNonZero);
// ten_pointed_star is a ten-pointed star with no self-intersections
var fifteen_pointed_star = ClipperLib.Clipper.SimplifyPolygon(five_pointed_star, ClipperLib.PolyFillType.pftEvenOdd);
// fifteen_pointed_star is a fifteen-pointed star with no self-intersections
</pre>
####

**See also:**
<a href="#clipperlibclipperstrictlysimple">Clipper.StrictlySimple</a>, <a href="#clipperlibclippercleanpolygons">CleanPolygons</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- Clipper Properties ---

### ClipperLib.Clipper.PreserveCollinear

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean PreserveCollinear;
</pre>
####

By default, when three or more vertices are collinear in input polygons (subject or clip), the Clipper object removes the 'inner' vertices before clipping. When enabled the PreserveCollinear property prevents this default behavior to allow these inner vertices to appear in the solution.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
cpr.PreserveCollinear = true;
</pre>
####

**See also:**
<a href="#clipperlibclipper">ClipperLib.Clipper()</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ReverseSolution

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean ReverseSolution;
</pre>
####

When this property is set to true, polygons returned in the solution parameter of the <a href="#clipperlibclipperexecute">Execute()</a> method will have orientations opposite to their normal orientations.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
cpr.ReverseSolution = true;
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Execute</a>, <a href="#clipperlibclipperorientation">Orientation</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.StrictlySimple

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean StrictlySimple;
</pre>
####

Terminology:
* A simple polygon is one that does not self-intersect.
* A weakly simple polygon is a simple polygon that contains 'touching' vertices, or 'touching' edges.
* A strictly simple polygon is a simple polygon that does not contain 'touching' vertices, or 'touching' edges.

Vertices 'touch' if they share the same coordinates (and are not adjacent). An edge touches another if one of its end vertices touches another edge excluding its adjacent edges, or if they are co-linear and overlapping (including adjacent edges).

Polygons returned by clipping operations (see <a href="#clipperlibclipperexecute">Clipper.Execute()</a>) should always be simple polygons. When the StrictlySimply property is enabled, polygons returned will be strictly simple, otherwise they may be weakly simple. It's computationally expensive ensuring polygons are strictly simple and so this property is disabled by default.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/simplify3.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/simplify2.png">

In the image above, the two examples show weakly simple polygons being broken into two strictly simple polygons. (The outlines with arrows are intended to aid visualizing vertex order.)

See also the article on <a href="http://en.wikipedia.org/wiki/Simple_polygon">Simple Polygon</a> on Wikipedia.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
cpr.StrictlySimple = true;
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Execute</a>, <a href="#clipperlibclippersimplifypolygons">SimplifyPolygons</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ZFillFunction

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void <a href="#clipperlibclipperzfillcallback">ZFillCallback</a> ZFillFunction;
</pre>
####

This property is only exposed if the Preprocessor directive <a href="#preprocessor-defines">use_xyz</a> has been defined. (If it is defined, a Z member will be added to the <a href="#clipperlibintpoint">IntPoint</a> structure.) When a custom callback function is assigned it will be called during clipping operations so custom Z values can be assigned intersection vertices.

Vertices in the solution of clipping operations more often than not correspond to input (subject or clip) vertices, but those vertices created at edge intersections do not. While the X and Y coordinates for these 'intersection' vertices are obviously defined by the points of intersection, there's no obvious way to assign their Z values. It really depends on the needs of the library user. While there are 4 vertices directly influencing an intersection vertex (ie the vertices on each end of the 2 intersecting edges), in an attempt to keep things simple only the vertices bounding one edge will be passed to the callback function.

The CurvesDemo application in the Curves directory in the distribution zip package shows how the Z member together with the callback function can be used to flatten curved paths (defined by control points) and after clipping, to 'de-flatten' or reconstruct curved paths in the clipping solution.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper();
cpr.ZFillFunction = function (vert1, vert2, intersectPt) { /* function body */ };
// or
var ClipCallback = function (vert1, vert2, intersectPt) { /* function body */ };
cpr.ZFillFunction = ClipCallback;
</pre>
####

**See also:**
<a href="#preprocessor-defines">Defines</a>, <a href="#clipperlibintpoint">IntPoint</a>, <a href="#clipperlibclipperzfillcallback">ZFillCallback</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Types

### ClipperLib.ClipType()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number ClipType {ctIntersection: 0, ctUnion: 1, ctDifference: 2, ctXor: 3};
</pre>
####

There are four boolean operations - AND, OR, NOT & XOR.

Given that subject and clip polygon brush 'filling' is defined both by their vertices and their respective <a href="#clipperlibpolyfilltype">filling rules</a>, the four boolean operations can be applied to polygons to define new filling regions:

* AND (intersection) - create regions where both subject and clip polygons are filled
* OR (union) - create regions where either subject or clip polygons (or both) are filled
* NOT (difference) - create regions where subject polygons are filled except where clip * polygons are filled
* XOR (exclusive or) - create regions where either subject or clip polygons are filled but not where both are filled

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/cliptype.png"/>

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/intersection.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/union.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/difference.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/xor.png"/>

All polygon clipping is performed with a <a href="#clipperlibclipper">Clipper</a> object with the specific boolean operation indicated by the ClipType parameter passed in its <a href="#clipperlibclipperexecute">Execute</a> method.

With regard to open paths (polylines), clipping rules generally match those of closed paths (polygons).

However, when there are both polyline and polygon subjects, the following clipping rules apply:

* union operations - polylines will be clipped by any overlapping polygons so that non-overlapped portions will be returned in the solution together with the union-ed polygons
* intersection, difference and xor operations - polylines will be clipped only by 'clip' polygons and there will be not interaction between polylines and subject polygons.

Example of clipping behaviour when mixing polyline and polygon subjects:

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/line_clipping2.png"/>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cliptype = ClipperLib.ClipType.ctIntersection;
var cliptype = ClipperLib.ClipType.ctUnion;
var cliptype = ClipperLib.ClipType.ctDifference;
var cliptype = ClipperLib.ClipType.ctXor;
</pre>
####

**See also:**
<a href="#clipperlibclipper">Clipper</a>, <a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibpolyfilltype">PolyFillType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.EndType

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ClipperLib.EndType = {etOpenSquare: 0, etOpenRound: 1, etOpenButt: 2, etClosedLine: 3,  etClosedPolygon: 4 };
</pre>
####

The EndType enumerator has 5 values:

* **etOpenSquare:** Ends are squared off and extended delta units
* **etOpenRound:** Ends are rounded off and extended delta units
* **etOpenButt:** Ends are squared off with no extension.
* **etClosedLine:** Ends are joined using the JoinType value and the path filled as a polyline
* **etClosedPolygon:** Ends are joined using the JoinType value and the path filled as a polygon
<span style="color:#CCCCCC">**etOpenSingle:** Offsets an open path in a single direction. Planned for a future update.</span>

Note: With etClosedPolygon and etClosedLine types, the path closure will be the same regardless of whether or not the first and last vertices in the path match.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/endtypes1.png"/>
<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/endtypes2.png"/>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var endtype = ClipperLib.EndType.etOpenSquare;
var endtype = ClipperLib.EndType.etOpenRound;
var endtype = ClipperLib.EndType.etOpenButt;
var endtype = ClipperLib.EndType.etClosedLine;
var endtype = ClipperLib.EndType.etClosedPolygon;
</pre>
####

**See also:**
<a href="#clipperlibclipperoffsetaddpath">ClipperOffset.AddPath</a>, <a href="#clipperlibclipperoffsetaddpaths">ClipperOffset.AddPaths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.EndType_

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
if (use_deprecated)
  ClipperLib.EndType_ = {etSquare: 0, etRound: 1, etButt: 2, etClosed: 3};
</pre>
####

**Deprecated.** See <a href="#clipperoffset">ClipperOffset</a> and <a href="#clipperlibendtype">EndType</a>.

The EndType_ enumerator has 4 values:

* etSquare: Ends are squared off at exactly delta units
* etRound: Ends are rounded off at exactly delta units
* etButt: Ends are squared off abruptly
* etClosed: Ends are joined using the JoinType value and the path filled as a polygon.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/endtypes.png"/>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var endtype = ClipperLib.EndType_.etSquare;
var endtype = ClipperLib.EndType_.etRound;
var endtype = ClipperLib.EndType_.etButt;
var endtype = ClipperLib.EndType_.etClosed;
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ExPolygon()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ExPolygon ExPolygon();
</pre>
####

Creates an instance of ExPolygon object.

This is not anymore in the original Clipper, but in JS version we provide it to ensure backward compatibility.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var expolygon = new ClipperLib.ExPolygon();
</pre>
####

**See also:**
<a href="#clipperlibjspolytreetoexpolygons">PolyTreeToExPolygons</a>, <a href="#clipperlibjsexpolygonstopaths">ExPolygonsToPaths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ExPolygons()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ExPolygons ExPolygons();
</pre>
####

Creates an instance of ExPolygons object ie array.

This is not anymore in the original Clipper, but in JS version we provide it to ensure backward compatibility.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var expolygons = new ClipperLib.ExPolygons();
</pre>
####

**See also:**
<a href="#clipperlibjspolytreetoexpolygons">PolyTreeToExPolygons</a>, <a href="#clipperlibjsexpolygonstopaths">ExPolygonsToPaths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### InitOptions

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number ioReverseSolution = 1;
Number ioStrictlySimple = 2;
Number ioPreserveCollinear = 4;
</pre>
####

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cpr = new ClipperLib.Clipper(ClipperLib.Clipper.ioStrictlySimple | ClipperLib.Clipper.ioPreserveCollinear);
// or
var cpr = new ClipperLib.Clipper(2 | 4);
</pre>
####

**See also:**
<a href="#clipperlibclipper">Constructor</a>, <a href="#clipperlibclipperpreservecollinear">Clipper.PreserveCollinear</a>, <a href="#clipperlibclipperreversesolution">Clipper.ReverseSolution</a>, <a href="#clipperlibclipperstrictlysimple">Clipper.StrictlySimple</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.IntPoint()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
IntPoint IntPoint(Number X, Number Y)
IntPoint IntPoint()
IntPoint IntPoint(IntPoint point)
</pre>
####

The IntPoint structure is used to represent all vertices in the Clipper Library. An "integer" storage type has been deliberately chosen to preserve <a href="http://www.mpi-inf.mpg.de/~kettner/pub/nonrobust_cgta_06.pdf">numerical robustness</a>. (Early versions of the library used floating point coordinates, but it became apparent that floating point imprecision would always cause occasional errors.)

A sequence of IntPoints are contained within a <a href="#clipperlibpath">Path</a> structure to represent a single contour.

As of version 6, IntPoint now has an optional third member 'Z'. This can be enabled by exposing (ie uncommenting) the PreProcessor define <a href="#preprocessor-defines">'use_xyz'</a>. When the Z member is used, its values will be copied to corresponding verticies in solutions to clipping operations. However, at points of intersection where there's no corresponding Z value, the value will be assigned zero unless a new value is provided by a user supplied <a href="#clipperlibclipperzfillfunction">callback function</a>.

Users wishing to clip or offset polygons containing floating point coordinates need to use appropriate scaling when converting these values to and from IntPoints.

See also the notes on <a href="#rounding">rounding</a>.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var point = new ClipperLib.IntPoint(10,20); // Creates object {"X":10,"Y":20}
var point2 = new ClipperLib.IntPoint(); // Creates object {"X":0,"Y":0}
var point3 = new ClipperLib.IntPoint(point); // Creates clone of point
</pre>
####

**See also:**
<a href="#rounding">Rounding</a>, <a href="#clipperlibclipperzfillfunction">Clipper.ZFillFunction</a>, <a href="#preprocessor-defines">Defines</a>, <a href="#clipperlibpath">Path</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.IntRect()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
IntRect IntRect(Number left, Number top, Number right, Number bottom);
IntRect IntRect(IntRect intRect);
IntRect IntRect();
</pre>
####

Structure returned by Clipper's <a href="#clipperlibclippergetbounds">GetBounds</a> method.

**See also:**
<a href="#clipperlibclippergetbounds">GetBounds</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JoinType

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ClipperLib.JoinType = {jtSquare: 0, jtRound: 1, jtMiter: 2};
</pre>
####

When adding paths to a <a href="#clipperoffset">ClipperOffset</a> object via the <a href="#clipperlibclipperoffsetaddpaths">AddPaths</a> method, the joinType parameter may be one of three types - jtMiter, jtSquare or jtRound.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/86de/attachment/jointypes.png"/>

* **jtMiter:** There's a necessary limit to mitered joins since offsetting edges that join at very acute angles will produce excessively long and narrow 'spikes'. To contain these potential spikes, the ClipperOffset object's <a href="#clipperlibclipperoffsetmiterlimit">MiterLimit</a> property specifies a maximum distance that vertices will be offset (in multiples of delta). For any given edge join, when miter offsetting would exceed that maximum distance, 'square' joining is applied.
* **jtRound:** While flattened paths can never perfectly trace an arc, they are approximated by a series of arc chords (see ClipperObject's <a href="#clipperlibclipperoffsetarctolerance">ArcTolerance</a> property).
* **jtSquare:** Squaring is applied uniformally at all convex edge joins at 1 × delta.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var jointype = ClipperLib.JoinType.jtSquare;
var jointype = ClipperLib.JoinType.jtRound;
var jointype = ClipperLib.JoinType.jtMiter;
</pre>
####

**See also:**
<a href="#clipperoffset">ClipperOffset</a>, <a href="#clipperlibclipperoffsetaddpaths">AddPaths</a>, <a href="#clipperlibclipperoffsetarctolerance">ArcTolerance</a>, <a href="#clipperlibclipperoffsetmiterlimit">MiterLimit</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Path()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Path Path()
</pre>
####

This structure contains a sequence of <a href="#clipperlibintpoint">IntPoint</a> vertices defining a single contour (see also <a href="#terminology">terminology</a>). Paths may be open and represent line segments bounded by 2 or more vertices, or they may be closed and represent polygons.

Multiple paths can be grouped into a <a href="#clipperlibpaths">Paths</a> structure.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = new ClipperLib.Path(); // Creates an empty array []
// or
var path = new Array();
// or
var path = [];
</pre>
####

**See also:**
<a href="#overview">Overview</a>, <a href="#example">Example</a>, <a href="#clipperbaseaddpath">ClipperBase.AddPath</a>, <a href="#clipperlibpolytree">PolyTree</a>, <a href="#clipperlibclipperorientation">Orientation</a>, <a href="#clipperlibintpoint">IntPoint</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Paths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Paths Paths()
</pre>
####

This structure is fundamental to the Clipper Library. It's an array of one or more <a href="#clipperlibpath">Path</a> structures. (The Path structure contains an ordered array of vertices that make a single contour.)

Paths may open (lines), or they may closed (polygons).

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = new ClipperLib.Paths(); // Creates an empty array []
// or
var paths = new Array();
// or
var paths = [];
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperbaseaddpath">ClipperBase.AddPath</a>, <a href="#clipperbaseaddpaths">ClipperBase.AddPaths</a>, <a href="#clipperlibclipperoffsetpaths">OffsetPaths</a>, <a href="#clipperlibintpoint">IntPoint</a>, <a href="#clipperlibpath">Path</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyFillType

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ClipperLib.PolyFillType = {pftEvenOdd: 0, pftNonZero: 1, pftPositive: 2, pftNegative: 3};
</pre>
####

Filling indicates regions that are inside a polygon (ie 'filled' with a brush color or pattern in a graphical display), and non-filling indicates regions outside polygons. The Clipper Library supports 4 filling rules: Even-Odd, Non-Zero, Positive and Negative.

The simplest filling rule is Even-Odd filling. Given a group of polygons and starting from a point outside, whenever a contour is crossed either filling starts if it had stopped or it stops if it had started. For example, given a single rectangular polygon, when its first (eg left) edge is crossed filling starts and we're inside the polygon. Filling stops again when the next (eg right) edge is crossed.

With the exception of Even-Odd filling, all other filling rules rely on edge direction and winding numbers to determine filling. Edge direction is determined by the order in which vertices are declared when constructing a polygon. Edge direction is used to determine the winding numbers of polygon regions and subregions.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/wn.png"/> The winding number for any given polygon sub-region can be derived by:

1. starting with a winding number of zero
2. from a point (P1) that's outside all polygons, draw an imaginary line to a point that's inside a given sub-region (P2)
3. while traversing the line from P1 to P2, for each polygon edge that crosses the line from right to left increment the winding number, and for each polygon edge that crosses the line from left to right decrement the winding number.
4. Once you arrive at the given sub-region you have its winding number.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/winding_number.png"/>

**Even-Odd (Alternate)**: Odd numbered sub-regions are filled, while even numbered sub-regions are not.
**Non-Zero (Winding)**: All non-zero sub-regions are filled.
**Positive**: All sub-regions with winding counts > 0 are filled.
**Negative**: All sub-regions with winding counts < 0 are filled.

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/evenodd.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/nonzero.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/positive.png"/><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/negative.png"/>

By far the most widely used fill rules are Even-Odd (aka Alternate) and Non-Zero (aka Winding). Most graphics rendering libraries (<a href="http://www.antigrain.com/__code/include/agg_basics.h.html#filling_rule_e">AGG</a>, <a href="http://developer.android.com/reference/android/graphics/Path.FillType.html">Android Graphics</a>, <a href="http://cairographics.org/manual/cairo-cairo-t.html#cairo-fill-rule-t">Cairo</a>, <a href="http://msdn.microsoft.com/en-us/library/windows/desktop/ms534120(v=vs.85).aspx">GDI+</a>, <a href="http://www.glprogramming.com/red/chapter11.html">OpenGL</a>, <a href="http://developer.apple.com/library/ios/#documentation/GraphicsImaging/Conceptual/drawingwithquartz2d/dq_paths/dq_paths.html#//apple_ref/doc/uid/TP30001066-CH211-TPXREF101">Quartz 2D</a> etc) and vector graphics storage formats (<a href="http://www.w3.org/TR/SVG/painting.html#FillRuleProperty">SVG</a>, Postscript, <a href="http://www.adobe.com/devnet-apps/photoshop/fileformatashtml/PhotoshopFileFormats.htm#50577409_17587">Photoshop</a> etc) support both these rules. However some libraries (eg Java's <a href="http://docs.oracle.com/javase/6/docs/api/java/awt/Graphics.html#fillPolygon(int[], int[], int)">Graphics2D</a>) only support one fill rule. <em>Android Graphics</em> and <em>OpenGL</em> are the only libraries (that I'm aware of) that support multiple filling rules.

It's useful to note that <em>edge direction</em> has no affect on a winding number's odd-ness or even-ness. (This is why <a href="#clipperlibclipperorientation">orientation</a> is ignored when the <em>Even-Odd</em> rule is employed.)

The direction of the Y-axis does affect polygon orientation and <em>edge direction</em>. However, changing Y-axis orientation will only change the <em>sign</em> of winding numbers, not their magnitudes, and has no effect on either <em>Even-Odd</em> or <em>Non-Zero</em> filling.</p>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polyfilltype = ClipperLib.PolyFillType.pftEvenOdd;
var polyfilltype = ClipperLib.PolyFillType.pftNonZero;
var polyfilltype = ClipperLib.PolyFillType.pftPositive;
var polyfilltype = ClipperLib.PolyFillType.pftNegative;
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibclipperorientation">Orientation</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyType

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number ClipperLib.PolyType = {ptSubject: 0, ptClip: 1};
</pre>
####

Boolean (clipping) operations are mostly applied to two sets of Polygons, represented in this library as subject and clip polygons. Whenever Polygons are added to the Clipper object, they must be assigned to either subject or clip polygons.

UNION operations can be performed on one set or both sets of polygons, but all other boolean operations require both sets of polygons to derive meaningful solutions.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polytype = ClipperLib.PolyType.ptSubject;
var polytype = ClipperLib.PolyType.ptClip;
</pre>
####

**See also:**
<a href="#clipperbaseaddpath">ClipperBase.AddPath</a>, <a href="#clipperbaseaddpaths">ClipperBase.AddPaths</a>, <a href="#clipperlibcliptype">ClipType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.Clipper.ZFillCallback()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ZFillCallback(<a href="#clipperlibintpoint">IntPoint</a> Z1, <a href="#clipperlibintpoint">IntPoint</a> Z2, <a href="#clipperlibintpoint">IntPoint</a> pt);
</pre>
####


**See also:**
<a href="#clipperlibclipperzfillfunction">Clipper.ZFillFunction</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## PolyTree

PolyTree is intended as a read-only data structure that should only be used to receive solutions from polygon clipping operations. It's an alternative data structure the Paths structure which can also receive clipping solutions. Its major advantages over the <a href="#clipperlibpaths">Paths</a> structure is that it properly represents the parent-child relationships of the returned polygons, and that it also differentiates between open and closed paths. However, since a PolyTree is more complex than a Paths structure, and because it's more computationally expensive to process (the Execute method being roughly 5-10% slower), it should only be used when parent-child polygon relationships are needed, or when open paths are being 'clipped'.

An empty PolyTree object can be passed as the solution parameter to a <a href="#clipper">Clipper</a> object's <a href="#clipperlibclipperexecute">Execute</a> method. Once the clipping operation is completed, this method returns with the PolyTree structure filled with data representing the solution.

A PolyTree object is a container for any number of <a href="#polynode">PolyNode</a> children, with each contained PolyNode representing a single polygon contour (either an <a href="#terminology">outer</a> or <a href="#terminology">hole</a> polygon). PolyTree itself is a specialized PolyNode whose immediate children represent the top-level outer polygons of the solution. (Its own <a href="#clipperlibpolynodecontour">Contour</a> property is always empty.) The contained top-level PolyNodes may contain their own PolyNode children representing hole polygons that may also contain children representing nested outer polygons etc. Children of outers will always be holes, and children of holes will always be outers.

PolyTrees can also contain open paths. Open paths will always be represented by top level PolyNodes. Two functions are provided to quickly separate out open and closed paths from a polytree - <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a> and <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a>.

<table><tr><td><img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/polytree.png"/></td><td><pre style="font-family: Verdana, Arial, Helvetica, sans-serif;">
    <b>polytree:</b>
    Contour = <b>()</b>
    ChildCount = <b>1</b>
    Childs[0]:
        Contour = ((10,10),(100,10),(100,100),(10,100))
        IsHole = <b>False</b>
        ChildCount = <b>1</b>
        Childs[0]:
            Contour = ((20,20),(20,90),(90,90),(90,20))
            IsHole = <b>True</b>
            ChildCount = <b>2</b>
            Childs[0]:
                Contour = ((30,30),(50,30),(50,50),(30,50))
                IsHole = <b>False</b>
                ChildCount = <b>0</b>
            Childs[1]:
                Contour = ((60,60),(80,60),(80,80),(60,80))
                IsHole = <b>False</b>
                ChildCount = <b>0</b>

            </pre></td></tr></table>

**See also:**
<a href="#overview">Overview</a>, <a href="#clipper">Clipper</a>, <a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibpolynode">PolyNode</a>, <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a>, <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- PolyTree methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyTree()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpolytree">PolyTree</a> PolyTree()
</pre>
####

Returns new PolyTree object.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polytree = new ClipperLib.PolyTree(); // creates PolyTree object
// cpr.Execute ...
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibpolynode">PolyNode</a>, <a href="#clipperlibclipperclosedpathsfrompolytree">ClosedPathsFromPolyTree</a>, <a href="#clipperlibclipperopenpathsfrompolytree">OpenPathsFromPolyTree</a>, <a href="#clipperlibpaths">Paths</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyTree.Clear()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void polytree.Clear()
</pre>
####

This method clears any PolyNode children contained by PolyTree the object.

Clear does not need to be called explicitly. The <a href="#clipperlibclipperexecute">Clipper.Execute</a> method that accepts a PolyTree parameter will automatically clear the PolyTree object before propagating it with new PolyNodes. Likewise, PolyTree's destructor will also automatically clear any contained PolyNodes.

**See also:**
<a href="#clipperlibclipperexecute">Clipper.Execute</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyTree.GetFirst()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpolynode">PolyNode</a> GetFirst()
</pre>
####

This method returns the first outer polygon contour if any, otherwise a null pointer.

This function is almost equivalent to calling Childs\[0\] except that when a PolyTree object is empty (has no children), calling Childs\[0\] would raise an out of range exception.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polynode = polytree.GetFirst();
</pre>
####

**See also:**
<a href="#clipperlibpolynodegetnext">PolyNode.GetNext</a>, <a href="#clipperlibpolynodechildcount">PolyNode.ChildCount</a>, <a href="#clipperlibpolynodechilds">PolyNode.Childs</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyTree.Total()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number Total() // read only
</pre>
####

Returns the total number of PolyNodes (polygons) contained within the PolyTree. This value is not to be confused with <a href="#clipperlibpolynodechildcount">ChildCount</a> which returns the number of immediate children only (<a href="#clipperlibpolynodechilds">Childs</a>) contained by PolyTree.

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var total = polytree.Total();
</pre>
####

**See also:**
<a href="#clipperlibpolynodechildcount">PolyNode.ChildCount</a>, <a href="#clipperlibpolynodechilds">PolyNode.Childs</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## PolyNode

PolyNodes are encapsulated within a <a href="#polytree">PolyTree</a> container, and together provide a data structure representing the parent-child relationships of polygon contours returned by Clipper's <a href="#clipperlibclipperexecute">Execute</a> method.

A PolyNode object represents a single polygon. Its <a href="#clipperlibpolynodeishole">IsHole</a> property indicates whether it's an <a href="#terminology">outer</a> or a <a href="#terminology">hole</a>. PolyNodes may own any number of PolyNode children (<a href="#clipperlibpolynodechilds">Childs</a>), where children of outer polygons are holes, and children of holes are (nested) outer polygons.

**See also:**
<a href="#overview">Overview</a>, <a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibpolytree">PolyTree</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- PolyNode methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpolynode">PolyNode</a> PolyNode() // read only
</pre>
####

Creates new PolyNode object.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polynode = new ClipperLib.PolyNode();
</pre>
####

**See also:**
<a href="#clipperlibclipperexecute">Clipper.Execute</a>, <a href="#clipperlibpolytree">PolyTree</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.ChildCount()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number ChildCount() // read only
</pre>
####

Returns the number of PolyNode <a href="#clipperlibpolynodechilds">Childs</a> directly owned by the PolyNode object.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var count = polynode.ChildCount();
</pre>
####

**See also:**
<a href="#clipperlibpolynodechilds">Childs</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.Childs()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Array < <a href="#clipperlibpolynode">PolyNode</a> > Childs() // read only
</pre>
####

Array of PolyNode. Outer PolyNode childs contain hole PolyNodes, and hole PolyNode childs contain nested outer PolyNodes.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var childs = polynode.Childs();
</pre>
####

**See also:**
<a href="#clipperlibpolynodechildcount">ChildCount</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.Contour()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpath">Path</a> Contour() // read only
</pre>
####

Returns a path list which contains any number of vertices.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var contour = polynode.Contour();
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.GetNext()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpolynode">PolyNode</a> GetNext()
</pre>
####

The returned Polynode will be the first child if any, otherwise the next sibling, otherwise the next sibling of the Parent etc.

A PolyTree can be traversed very easily by calling GetFirst() followed by GetNext() in a loop until the returned object is a null pointer ...

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var polytree = new ClipperLib.PolyTree();
//call to Clipper.Execute method here which fills 'polytree'

var polynode = polytree.GetFirst();
while (polynode)
{
  //do stuff with polynode here

  polynode = polynode.GetNext();
}
</pre>
####

**See also:**
<a href="#clipperlibpolytreegetfirst">PolyTree.GetFirst</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.IsHole()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean IsHole() // read only
</pre>
####

Returns true when the PolyNode's polygon (<a href="#clipperlibpolynodecontour">Contour</a>) is a <a href="#terminology">hole</a>.

Children of outer polygons are always holes, and children of holes are always (nested) outer polygons.

The IsHole property of a <a href="#clipperlibpolytree">PolyTree</a> object is undefined but its children are always top-level outer polygons.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var ishole = polynode.IsHole();
</pre>
####

**See also:**
<a href="#clipperlibpolynodecontour">Contour</a>, <a href="#clipperlibpolytree">PolyTree</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.Parent()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpolynode">PolyNode</a> Parent(); read only
</pre>
####

Returns the parent PolyNode.

The PolyTree object (which is also a PolyNode) does not have a parent and will return a null pointer.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var parent = polynode.Parent();
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- PolyNode properties ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.PolyNode.IsOpen

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Boolean IsOpen // read only property
</pre>
####

Returns true when the PolyNode's <a href="#clipperlibpolynodecontour">Contour</a> results from a clipping operation on an open contour (path). Only top-level PolyNodes can contain open contours.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var isopen = polynode.IsOpen;
</pre>
####

**See also:**
<a href="#clipperlibpolynodecontour">Contour</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## ClipperOffset

The ClipperOffset class encapsulates the process of offsetting (inflating/deflating) both open and closed paths.

This class replaces the now deprecated OffsetPaths function which is/was less flexible. The Execute method can be called multiple times using different offsets (deltas) without having to reassign paths. Offsetting can now be performed on a mixture of open and closed paths in a single operation. Also, the dual functionality of OffsetPaths' Limit parameter was not only confusing some users, but it also prevented a custom RoundPrecision being assigned when EndType was etRound and JoinType was jtMiter.

When offsetting closed paths (polygons), it's important that:

1. their orientations are consistent such that outer polygons share the same orientation while holes have the opposite orientation
2. they do not self-intersect.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- ClipperOffset methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
ClipperOffset ClipperOffset(Number miterLimit = 2.0, Number roundPrecision = 0.25);
</pre>
####

The ClipperOffset constructor takes 2 optional parameters: <a href="#clipperlibclipperoffsetmiterlimit">MiterLimit</a> and <a href="#clipperlibclipperoffsetarctolerance">ArcTolerance</a>. These two parameters corresponds to properties of the same name. MiterLimit is only relevant when JoinType is jtMiter, and ArcTolerance is only relevant when JoinType is jtRound or when EndType is etOpenRound.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var co = new ClipperLib.ClipperOffset(2.0, 0.25);
</pre>
####

**See also:**
<a href="#clipperlibclipperoffsetarctolerance">ArcTolerance</a>, <a href="#clipperlibclipperoffsetmiterlimit">MiterLimit</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.AddPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void AddPath(<a href="#clipperlibpath">Path</a> path, <a href="#clipperlibjointype">JoinType</a> jointype, <a href="#clipperlibendtype">EndType</a> endtype);
</pre>
####

Adds a path to a ClipperOffset object in preparation for offsetting. This method can be called multiple times.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var co = new ClipperLib.ClipperOffset(2, 0.25);
co.AddPath(path, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
</pre>
####

**See also:**
<a href="#clipperlibjointype">JoinType</a>, <a href="#clipperlibendtype">EndType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.AddPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void AddPaths(<a href="#clipperlibpaths">Paths</a> paths, <a href="#clipperlibjointype">JoinType</a> jointype, <a href="#clipperlibendtype">EndType</a> endtype);
</pre>
####

Adds paths to a ClipperOffset object in preparation for offsetting. This method can be called multiple times.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
             [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var co = new ClipperLib.ClipperOffset(2, 0.25);
co.AddPaths(paths, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon);
</pre>
####

**See also:**
<a href="#clipperlibjointype">JoinType</a>, <a href="#clipperlibendtype">EndType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.Clear()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void Clear();
</pre>
####

This method clears all paths from the ClipperOffset object, allowing new paths to be assigned.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var co = new ClipperLib.ClipperOffset();
co.AddPath(path, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
co.Clear();
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.Execute()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void Execute(<a href="#clipperlibpaths">Paths</a> solution, Number delta);
void Execute(<a href="#clipperlibpolytree">PolyTree</a> polytree, Number delta);
</pre>
####

This method takes two parameters. The first is the structure (either PolyTree or Paths) that will receive the result of the offset operation. The second parameter is the amount to which the supplied paths will be offset - negative delta values to shrink polygons and positive delta to expand them.

This method can be called multiple times, offsetting the same paths by different amounts (ie using different deltas).

**A note about scaling:**

Because ClipperOffset uses integer coordinates, you have to scale coordinates to maintain precision and make arcs smooth - also in the case of integer input.

Javascript Clipper provides four functions for this purpose: <a href="#clipperlibjsscaleuppath">ScaleUpPath</a>, <a href="#clipperlibjsscaleuppaths">ScaleUpPaths</a>, <a href="#clipperlibjsscaledownpath">ScaleDownPath</a> and <a href="#clipperlibjsscaledownpaths">ScaleDownPaths</a>.

Scaling is highly recommended if JoinType is jtRound or EndType is etRound.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var subj = new ClipperLib.Paths();
var solution = new ClipperLib.Paths();
subj[0] = [{"X":348,"Y":257},{"X":364,"Y":148},{"X":362,"Y":148},{"X":326,"Y":241},{"X":295,"Y":219},{"X":258,"Y":88},{"X":440,"Y":129},{"X":370,"Y":196},{"X":372,"Y":275}];
var scale = 100;
ClipperLib.JS.ScaleUpPaths(subj, scale);
var co = new ClipperLib.ClipperOffset(2, 0.25);
co.AddPaths(subj, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
co.Execute(solution, -7.0);
ClipperLib.JS.ScaleDownPaths(subj, scale);
//draw solution with your own drawing function...
DrawPolygons(solution, 0x4000FF00, 0xFF009900);
</pre>
####

**See also:**
<a href="#clipperlibjsscaleuppath">ScaleUpPath</a>, <a href="#clipperlibjsscaleuppaths">ScaleUpPaths</a>, <a href="#clipperlibjsscaledownpath">ScaleDownPath</a>, <a href="#clipperlibjsscaledownpaths">ScaleDownPaths</a>.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- ClipperOffset properties ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.ArcTolerance

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number ArcTolerance
</pre>
####

Firstly, this field/property is only relevant when JoinType = jtRound and/or EndType = etRound.

Since flattened paths can never perfectly represent arcs, this field/property specifies a maximum acceptable imprecision ('tolerance') when arcs are approximated in an offsetting operation. Smaller values will increase 'smoothness' up to a point though at a cost of performance and in creating more vertices to construct the arc.

The default ArcTolerance is 0.25 units. This means that the maximum distance the flattened path will deviate from the 'true' arc will be no more than 0.25 units (before rounding).

Reducing tolerances below 0.25 will **not** improve smoothness since vertex coordinates will still be rounded to integer values. The only way to achieve sub-integer precision is through coordinate scaling before and after offsetting (see example below).

It's important to make ArcTolerance a sensible fraction of the offset delta (arc radius). Large tolerances relative to the offset delta will produce poor arc approximations but, just as importantly, very small tolerances will substantially slow offsetting performance while providing unnecessary degrees of precision. This is most likely to be an issue when offsetting polygons whose coordinates have been scaled to preserve floating point precision.

**Example:** Imagine a set of polygons (defined in floating point coordinates) that is to be offset by 10 units using round joins, and the solution is to retain floating point precision up to at least 6 decimal places.
To preserve this degree of floating point precision, and given that Clipper and ClipperOffset both operate on integer coordinates, the polygon coordinates will be scaled up by 108 (and rounded to integers) prior to offsetting. Both offset delta and ArcTolerance will also need to be scaled by this same factor. If ArcTolerance was left unscaled at the default 0.25 units, every arc in the solution would contain a fraction of 44 THOUSAND vertices while the final arc imprecision would be 0.25 × 10-8 units (ie once scaling was reversed). However, if 0.1 units was an acceptable imprecision in the final unscaled solution, then ArcTolerance should be set to 0.1 × scaling_factor (0.1 × 108 ). Now if scaling is applied equally to both ArcTolerance and to Delta Offset, then in this example the number of vertices (steps) defining each arc would be a fraction of 23.

<!--The formula for the number of steps in a full circular arc is ... Pi / acos(1 - arc_tolerance / abs(delta))-->

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var co = new ClipperLib.ClipperOffset();
co.ArcTolerance = 1.23;
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.ClipperOffset.MiterLimit

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number MiterLimit
</pre>
####

This property sets the maximum distance in multiples of delta that vertices can be offset from their original positions before squaring is applied. (Squaring truncates a miter by 'cutting it off' at 1 × delta distance from the original vertex.)

**The default value for MiterLimit is 2** (ie twice delta). This is also the smallest MiterLimit that's allowed. If mitering was unrestricted (ie without any squaring), then offsets at very acute angles would generate unacceptably long 'spikes'.

An example of an offsetting 'spike' at a narrow angle that's a consequence of using a large MiterLimit (25) ...

<img src="https://sourceforge.net/p/jsclipper/wiki/_discuss/thread/f3a2fc70/6d6f/attachment/miterlimit.png"/>

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var co = new ClipperLib.ClipperOffset();
co.MiterLimit = 4.1;
</pre>
####

**See also:**
<a href="#clipperlibjointype">JoinType</a>

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Rounding

By using an integer type for polygon coordinates, the Clipper Library has been able to avoid problems of numerical robustness that can cause havoc with geometric computations. Problems associated with integer rounding and their possible solutions are discussed <a href="http://www.angusj.com/delphi/clipper/documentation/Docs/Overview/Rounding.htm">in the original documentation</a>.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## JS

JS is a special object to ensure backward compatibility and make it easier to run frequent tasks.

It is not available in original Clipper.

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### --- JS methods ---

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.AreaOfPolygon()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number AreaOfPolygon(<a href="#clipperlibpath">Path</a> poly, Number scale = 1);
</pre>
####

Returns the area of a closed Path. If the path is already scaled up, you can set scale value to force function to return downscaled area.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var area = ClipperLib.JS.AreaOfPolygon (path, 1);
// area is 10000
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.AreaOfPolygons()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number AreaOfPolygons(<a href="#clipperlibpaths">Paths</a> polys, Number scale = 1);
</pre>
####

Returns the area of a closed Paths. If it is already scaled up, you can set scale value to force function to return downscaled area.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
            [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var area = ClipperLib.JS.AreaOfPolygons (paths, 1);
// area is now 3600
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.BoundsOfPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibintrect">IntRect</a> BoundsOfPath(<a href="#clipperlibpath">Path</a> path, Number scale = 1);
</pre>
####

Returns an IntRect object which describes the bounding box of a Path. If the path is already scaled up, you can set scale value to force function to return downscaled bounds.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var bounds = ClipperLib.JS.BoundsOfPath (path, 1);
// bounds is {"left":10,"top":10,"right":110,"bottom":110}
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.BoundsOfPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibintrect">IntRect</a> BoundsOfPaths(<a href="#clipperlibpaths">Paths</a> paths, Number scale = 1);
</pre>
####

Returns an IntRect object which describes the bounding box of a Paths. If it is already scaled up, you can set scale value to force function to return downscaled bounds.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
            [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var bounds = ClipperLib.JS.BoundsOfPaths (paths, 1);
// bounds is {"left":10,"top":10,"right":110,"bottom":110}
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.Clone()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpath">Path</a> Clone(<a href="#clipperlibpath">Path</a> path);
<a href="#clipperlibpaths">Paths</a> Clone(<a href="#clipperlibpaths">Paths</a> paths);
</pre>
####

Makes a deep copy of Path or Paths so that also IntPoint objects are cloned and not only referenced.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cloned_path = ClipperLib.JS.Clone(path);
// or
var cloned_paths = ClipperLib.JS.Clone(paths);
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.Clean()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpath">Path</a> Clean(<a href="#clipperlibpath">Path</a> path);
<a href="#clipperlibpaths">Paths</a> Clean(<a href="#clipperlibpaths">Paths</a> paths);
</pre>
####

Joins vertices that are too near each other and would cause distortion in offsetting without cleaning.

This function differs from CleanPolygon and CleanPolygons, which clean also collinear vertices.

Ideal for situations where you need to prevent distortion and not do anything else.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var cleaned_path = ClipperLib.JS.Clean (path, delta);
// or
var cleaned_paths = ClipperLib.JS.Clean (paths, delta);
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.Lighten()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpath">Path</a> Lighten(<a href="#clipperlibpath">Path</a> path, Number tolerance);
<a href="#clipperlibpaths">Paths</a> Lighten(<a href="#clipperlibpaths">Paths</a> paths, Number tolerance);
</pre>
####

Removes points that doesn't affect much to the visual appearance. If middle point is at or under certain distance (tolerance) of the line segment between start and end point, the middle point is removed.

Helps to speedup calculations and rendering.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var scale = 100;
var lightened_path = ClipperLib.JS.Lighten(path, 0.1 * scale);
// or
var lightened_paths = ClipperLib.JS.Lighten(paths, 0.1 * scale);
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.PerimeterOfPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number PerimeterOfPath(<a href="#clipperlibpath">Path</a> path, Boolean closed, Number scale = 1);
</pre>
####

Returns the perimeter of a Path. If the Path is closed (ie polygon), a clone of the first vertex is added to the end of the Path and removed after calculation to ensure that whole ("polygonal") perimeter is taken into account.

Open paths (ie lines) are measured by taking into account only the existing vertices.

If the path goes back the same way, every line segment is calculated, which means that the returned perimeter is longer than the visual perimeter.

If coordinates are upscaled beforehand by some scaling factor (eg. 100), and scale parameter is provided to the function, the downscaled, real perimeter is returned.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
var polygonal_perimeter = ClipperLib.JS.PerimeterOfPath(path, true, 1);
// polygonal_perimeter is 400

// But...
var line_perimeter = ClipperLib.JS.PerimeterOfPath(path, false, 1);
// line_perimeter is 300
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.PerimeterOfPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
Number PerimeterOfPaths(<a href="#clipperlibpaths">Paths</a> paths, Boolean closed, Number scale = 1);
</pre>
####

Returns the sum of perimeters of individual paths contained in the paths. See also <a href="#clipperlibjsperimeterofpath">PerimeterOfPath</a>.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
            [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
var polygonal_perimeter = ClipperLib.JS.PerimeterOfPaths (paths, true, 1);
// polygonal_perimeter is 720

var line_perimeter = ClipperLib.JS.PerimeterOfPaths (paths, false, 1);
// line_perimeter is 540
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.ScaleDownPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ScaleDownPath(<a href="#clipperlibpath">Path</a> path, Number scale = 1);
</pre>
####

Divides each coordinate of Path by scale value.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:1000,Y:1000},{X:11000,Y:1000},{X:11000,Y:11000},{X:1000,Y:11000}];
ClipperLib.JS.ScaleDownPath (path, 100);
// path is [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.ScaleDownPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ScaleDownPaths(<a href="#clipperlibpaths">Paths</a> paths, Number scale = 1);
</pre>
####

Divides each coordinate of Paths by scale value.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:1000,Y:1000},{X:11000,Y:1000},{X:11000,Y:11000},{X:1000,Y:11000}],
             [{X:2000,Y:2000},{X:2000,Y:10000},{X:10000,Y:10000},{X:10000,Y:2000}]];
ClipperLib.JS.ScaleDownPaths (path, 100);
// path is [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
//          [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.ScaleUpPath()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ScaleUpPath(<a href="#clipperlibpath">Path</a> path, Number scale = 1);
</pre>
####

Multiplies each coordinate of a Path by scaling coefficient and rounds to the nearest integer using Math.round().

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var path = [{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}];
ClipperLib.JS.ScaleUpPath (path, 100);
// path is now [{X:1000,Y:1000},{X:11000,Y:1000},{X:11000,Y:11000},{X:1000,Y:11000}];
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.ScaleUpPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
void ScaleUpPaths(<a href="#clipperlibpaths">Paths</a> paths, Number scale = 1);
</pre>
####

Multiplies each coordinate of Paths by scaling coefficient and rounds to the nearest integer using Math.round().

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
            [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
ClipperLib.JS.ScaleUpPaths (path, 100);
// path is now [[{X:1000,Y:1000},{X:11000,Y:1000},{X:11000,Y:11000},{X:1000,Y:11000}],
//              [{X:2000,Y:2000},{X:2000,Y:10000},{X:10000,Y:10000},{X:10000,Y:2000}]];
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.PolyTreeToExPolygons()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibexpolygons">ExPolygons</a> PolyTreeToExPolygons(<a href="#clipperlibpolytree">PolyTree</a> polytree)
</pre>
####

Converts PolyTree to ExPolygons.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var expolygons = ClipperLib.JS.PolyTreeToExPolygons(polytree);
</pre>
####

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

### ClipperLib.JS.ExPolygonsToPaths()

<pre style="margin:0;word-wrap:normal;background-color:#FCE4EA;">
<a href="#clipperlibpaths">Paths</a> ExPolygonsToPaths(<a href="#clipperlibexpolygons">ExPolygons</a> expolygons)
</pre>
###

Converts ExPolygons to Paths.

**Usage:**

<pre style="margin:0;word-wrap:normal;background-color:#C5F7D0;">
var paths = ClipperLib.JS.ExPolygonsToPaths(expolygons);
</pre>
###

<hr style="padding:1px; background-color:#D3D3D3; width:auto;margin-left:0">

## Copyright

Texts and images have been copied (with permission) from the original <a href="http://www.angusj.com/delphi/clipper/documentation/">Clipper Documentation</a>, with some modifications to fit the Javascript environment.

Clipper Documentation is copyright 2010-2014 Angus Johnson.

Modifications copyright 2013-2014 Timo.
