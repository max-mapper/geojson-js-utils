GeoJSON Utilities for JavaScript
================================

Here you will find some functions to help you manipulate and work with GeoJSON
objects.

Some algorithms adapted from [bjwbell/canvas-geolib](https://github.com/bjwbell/canvas-geolib)

## How to use!

Load up in a browser OR `npm install geojson-utils`

```javascript
var gju = require('geojson-utils');
```

You now have an object named `gju` that contains all of the helper functions.

Remember, GeoJSON coordinates are ordered [x,y] or [longitude,latitude] to comply with the Open
Geospatial Consortium's recommendation!

## Line intersections

```javascript
gju.linesIntersect({ "type": "LineString", "coordinates": [[0, 2], [5, 2]] },
                 { "type": "LineString", "coordinates": [[3, 0], [3, 4], [4,4], [4,0]] })
// [{"type":"Point","coordinates":[2,3]},{"type":"Point","coordinates":[2,4]}]

gju.linesIntersect({ "type": "LineString", "coordinates": [[0, 2], [5, 2]] },
                 { "type": "LineString", "coordinates": [[0, 0], [5, 0]] })
// false
```

## Point in polygon

```javascript
gju.pointInPolygon({"type":"Point","coordinates":[3,3]},
                 {"type":"Polygon", "coordinates":[[[0,0],[6,0],[6,6],[0,6]]]})
// [{"type":"Point","coordinates":[3,3]}]
gju.pointInPolygon({"type":"Point","coordinates":[-1,-1]},
                 {"type":"Polygon", "coordinates":[[[0,0],[6,0],[6,6],[0,6]]]})
// false
```

## Radius filtering

If you retrieve a bunch of results from a bounding box query (common with R-tree
geo DBs), but you want to filter the rectangular result set by circular radius:

```javascript
// get the center of the original bounding box
var center = gju.rectangleCentroid({
  "type": "Polygon",
  "coordinates": [[[-122.677, 45.523], [-122.675, 45.524]]]
}),
// radius (in meters)
radius = 100;

for (var i in geometryObjectsWithinBBox) {
  if (gju.geometryWithinRadius(geometryObjectsWithinBBox[i], center, radius)) {
    // ... do stuff with objects inside the circle
  }
}
```

## Distance between two points

Uses the Haversine distance formula to calculate the distance between two points
on the Earth's curved surface (as the crow flies, no hills!). Returns the
distance in meters.

```javascript
gju.pointDistance({type: 'Point', coordinates:[-122.67738461494446, 45.52319466622903]},
                  {type: 'Point', coordinates:[-122.67652630805969, 45.52319466622903]})
// 66.86677669313518
```

## and much much more!

* "example usage with [GeoCouch](https://github.com/maxogden/vmxch/blob/master/lists/radius.js)"

#### License

The MIT License

Copyright (c) 2010 Max Ogden

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
