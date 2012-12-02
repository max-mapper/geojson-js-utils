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

console.log('all passed')