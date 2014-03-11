var gju = require('./')

var diagonalUp = { "type": "LineString","coordinates": [
  [0, 0], [10, 10]
]}
var diagonalDown = { "type": "LineString","coordinates": [
  [10, 0], [0, 10]
]}
var farAway = { "type": "LineString","coordinates": [
  [100, 100], [110, 110]
]}

if (!gju.lineStringsIntersect(diagonalUp, diagonalDown)) throw new Error()
if (gju.lineStringsIntersect(diagonalUp, farAway)) throw new Error()

var box = {
  "type": "Polygon",
    "coordinates": [
      [ [0, 0], [10, 0], [10, 10], [0, 10] ]
    ]
}

var inBox = {"type": "Point", "coordinates": [5, 5]}
var outBox = {"type": "Point", "coordinates": [15, 15]}

if (!gju.pointInPolygon(inBox, box)) throw new Error()
if (gju.pointInPolygon(outBox, box)) throw new Error()

if (gju.drawCircle(10, {"type": "Point", "coordinates": [0, 0]}).coordinates[0].length !== 15) throw new Error()
if (gju.drawCircle(10, {"type": "Point", "coordinates": [0, 0]}, 50).coordinates[0].length !== 50) throw new Error()

var centroid = gju.rectangleCentroid(box)
if (centroid.coordinates[0] !== 5) throw new Error()
if (centroid.coordinates[1] !== 5) throw new Error()

var fairyLand = {"type": "Point", "coordinates": [-122.260000705719, 37.80919060818706]}
var navalBase = {"type": "Point", "coordinates": [-122.32083320617676, 37.78774223089045]}
if (Math.floor(gju.pointDistance(fairyLand, navalBase)) !== 5852) throw new Error()


var point = {"type":  "Point", "coordinates": [ 705, 261 ]};
var poly = {"type": "Polygon", "coordinates": [ [702.5,344.50000000000006], [801.890625,
	245.109375], [749.7351485148515,234.28465346534657] ]};

if (gju.pointInPolygon(point,poly)) throw new Error();

point = {"type": "Point", "coordinates": [0.5, 0.5]};

poly = {"type": "Polygon", "coordinates": [[[0, 2], [2, 2], [2,0]]]};

if (gju.pointInPolygon(point,poly)) throw new Error();

console.log('all passed')