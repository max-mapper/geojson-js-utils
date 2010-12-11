exports.init = function() {
  var g = {};
  
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

  g.linesIntersect = function(seg1, seg2) {
  	var p = seg1[0],
  	    r = g.subtractVector(seg1[1], p),
  	    q = seg2[0],
  	    s = g.subtractVector(seg2[1], q);
  	var rCrossS = g.crossProduct(r, s);
  	var t = g.cross(g.subtractVector(q,p), s) / rCrossS;
  	var u = g.cross(g.subtractVector(q,p), r) / rCrossS;
  	if (0 <= u && u <= 1 && 0 <= t && t <= 1) {
  		var intersectionPoint = g.addVector(p, g.scalarMultiply(r, t));
  		return intersectionPoint;
  	} else {
  		return false;
  	}
  }
  
  g.pointInPolygon = function(pt, poly) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i][1] <= pt[1] && pt[1] < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1]))
      && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0])
      && (c = !c);
    return c;
  }
  
  g.numberToRadius = function(number) {
	   return number * Math.PI / 180;
	}

	g.numberToDegree = function(number) {
	   return number * 180 / Math.PI;
	}
	
  g.drawCircle = function(radius, center) {
    // convert degree/km to radiant
    var dist = radius / 6371;
    var radCenter = [g.numberToRadius(center[0]), g.numberToRadius(center[1])];
    // 15 sided circle; the larger the radius the more inaccurate it will be
    var steps = 15;
    var poly = [[center[0], center[1]]];
    for (var i = 0; i < steps; i++) {
    	var brng = 2 * Math.PI * i / steps;  
    	var lat = Math.asin(Math.sin(radCenter[0]) * Math.cos(dist) + 
                Math.cos(radCenter[0]) * Math.sin(dist) * Math.cos(brng));
    	var lng = radCenter[1] + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                        Math.cos(radCenter[0]), 
                        Math.cos(dist) - Math.sin(radCenter[0]) *
                        Math.sin(lat));

        poly[i] = [];
        poly[i][0] = g.numberToDegree(lat);
        poly[i][1] = g.numberToDegree(lng);
    }
    return poly;
  }
  
  g.rectangleCentroid = function(bbox) {
    var xmin = bbox[0], ymin = bbox[1], xmax = bbox[2], ymax = bbox[3];
    var xwidth = xmax - xmin;
    var ywidth = ymax - ymin;
    return [xmin + xwidth/2, ymin + ywidth/2];
  }
  
  g.metersToDegrees = function(meters) {
    //non spherical; the larger the area the more innaccurate it will be
    return meters/111319.9;
  }
  
  return g;
}