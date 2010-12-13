exports.init = function() {
  var g = {};

  // adapted from http://bloggingmath.wordpress.com/2009/05/29/line-segment-intersection/
  g.linesIntersect = function(linestring1, linestring2) {
    var seg1 = linestring1.coordinates,
        seg2 = linestring2.coordinates,
        p = seg1[0],
  	    r = g.subtractVector(seg1[1], p),
  	    q = seg2[0],
  	    s = g.subtractVector(seg2[1], q);
  	var rCrossS = g.crossProduct(r, s);
  	var t = g.cross(g.subtractVector(q,p), s) / rCrossS;
  	var u = g.cross(g.subtractVector(q,p), r) / rCrossS;
  	if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
  		var intersectionPoint = g.addVector(p, g.scalarMultiply(r, t));
  		return { 'type': 'Point',
  		         'coordinates': intersectionPoint };
  	} else {
  		return false;
  	}
  }

  g.scalarMultiply = function(xy, scalar) {
    return [xy[0] * scalar, xy[1] * scalar];
  }

  g.subtractVector = function(xy, vector) {
    return g.add(xy, g.scalarMultiply(vector, -1));
  }

  g.addVector = function(xy, vector) {
    return [xy[0] + vector[0], xy[1] + vector[1]];
  }

  g.crossProduct = function(v1, v2) {
    return v1[0] * v2[1] - v2[0] * v1[1];
  }

  // adapted from http://jsfromhell.com/math/is-point-in-poly
  g.pointInPolygon = function(point, polygon) {
    var x = point.coordinates[1],
        y = point.coordinates[0],
        poly = polygon.coordinates[0]; //TODO: support polygons with holes
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      var px = poly[i][1], py = poly[i][0],
          jx = poly[j][1], jy = poly[j][0];
      if (((py <= y && y < jy) || (jy <= y && y < py)) && (x < (jx - px) * (y - py) / (jy - py) + px)) {
        c = true;
      }
    }
    return c;
  }
  
  g.numberToRadius = function(number) {
     return number * Math.PI / 180;
  }

  g.numberToDegree = function(number) {
     return number * 180 / Math.PI;
  }
  
  // written with help from @tautologe 
  g.drawCircle = function(radiusInMeters, centerPoint) {
    var center = [centerPoint.coordinates[1], centerPoint.coordinates[0]],
        dist = (radiusInMeters / 1000) / 6371, // convert meters to radiant
        radCenter = [g.numberToRadius(center[0]), g.numberToRadius(center[1])],
        steps = 15, // 15 sided circle
        poly = [[center[0], center[1]]];
    for (var i = 0; i < steps + 1; i++) {
    	var brng = 2 * Math.PI * i / steps;  
    	var lat = Math.asin(Math.sin(radCenter[0]) * Math.cos(dist) + 
                Math.cos(radCenter[0]) * Math.sin(dist) * Math.cos(brng));
    	var lng = radCenter[1] + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                        Math.cos(radCenter[0]), 
                        Math.cos(dist) - Math.sin(radCenter[0]) *
                        Math.sin(lat));
        poly[i] = [];
        poly[i][1] = g.numberToDegree(lat);
        poly[i][0] = g.numberToDegree(lng);
    }
    return { "type": "Polygon",
             "coordinates": [poly] };
  }

  g.rectangleCentroid = function(rectangle) {
    var bbox = rectangle.coordinates[0];
    var xmin = bbox[0][0], ymin = bbox[0][1], xmax = bbox[1][0], ymax = bbox[1][1];
    var xwidth = xmax - xmin;
    var ywidth = ymax - ymin;
    return { 'type': 'Point',
  	         'coordinates': [xmin + xwidth/2, ymin + ywidth/2] };
  }
  
  return g;
}