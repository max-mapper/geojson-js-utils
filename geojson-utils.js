(function() {
  var gju = this.gju = {};
  
  // Export the geojson object for **CommonJS**
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = gju;
  }
  
  // adapted from http://www.kevlindev.com/gui/math/intersection/Intersection.js
  gju.lineStringsIntersect = function(l1, l2) {
    var intersects = [];
    for (var i = 0; i <= l1.coordinates.length - 2; ++i) {
      for (var j = 0; j <= l2.coordinates.length - 2; ++j) {            
        var a1 = {x: l1.coordinates[i][1], y: l1.coordinates[i][0]},
            a2 = {x: l1.coordinates[i+1][1], y: l1.coordinates[i+1][0]},
            b1 = {x: l2.coordinates[j][1], y: l2.coordinates[j][0]},
            b2 = {x: l2.coordinates[j+1][1], y: l2.coordinates[j+1][0]},
            ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
            ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
            u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if ( u_b != 0 ) {
          var ua = ua_t / u_b,
              ub = ub_t / u_b;
          if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            intersects.push({ 
              'type': 'Point',
              'coordinates': [a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)]
            });
          }
        }
      }
    }
    if (intersects.length == 0) intersects = false;
    return intersects;
  }

  // adapted from http://jsfromhell.com/math/is-point-in-poly
  gju.pointInPolygon = function(point, polygon) {
    var x = point.coordinates[1],
        y = point.coordinates[0],
        poly = polygon.coordinates[0]; //TODO: support polygons with holes
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) {
      var px = poly[i][1], py = poly[i][0],
          jx = poly[j][1], jy = poly[j][0];
      if (((py <= y && y < jy) || (jy <= y && y < py)) && (x < (jx - px) * (y - py) / (jy - py) + px)) {
        c = [point];
      }
    }
    return c;
  }
  
  gju.numberToRadius = function(number) {
     return number * Math.PI / 180;
  }

  gju.numberToDegree = function(number) {
     return number * 180 / Math.PI;
  }
  
  // written with help from @tautologe 
  gju.drawCircle = function(radiusInMeters, centerPoint) {
    var center = [centerPoint.coordinates[1], centerPoint.coordinates[0]],
        dist = (radiusInMeters / 1000) / 6371, // convert meters to radiant
        radCenter = [gju.numberToRadius(center[0]), gju.numberToRadius(center[1])],
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
        poly[i][1] = gju.numberToDegree(lat);
        poly[i][0] = gju.numberToDegree(lng);
    }
    return { "type": "Polygon",
             "coordinates": [poly] };
  }

  gju.rectangleCentroid = function(rectangle) {
    var bbox = rectangle.coordinates[0];
    var xmin = bbox[0][0], ymin = bbox[0][1], xmax = bbox[1][0], ymax = bbox[1][1];
    var xwidth = xmax - xmin;
    var ywidth = ymax - ymin;
    return { 'type': 'Point',
  	         'coordinates': [xmin + xwidth/2, ymin + ywidth/2] };
  }
  
  // from http://www.movable-type.co.uk/scripts/latlong.html
  gju.pointDistance = function(pt1, pt2) {
    var lon1 = pt1.coordinates[0], lat1 = pt1.coordinates[1],
        lon2 = pt2.coordinates[0], lat2 = pt2.coordinates[1],
        dLat = gju.numberToRadius(lat2 - lat1),
        dLon = gju.numberToRadius(lon2 - lon1),
        a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(gju.numberToRadius(lat1)) * Math.cos(gju.numberToRadius(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2),
        c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (6371 * c) * 1000; // returns meters
  }

})();