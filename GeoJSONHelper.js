var GeoJSON = function() {
  return {
    // map borrowed from http://github.com/janl/mustache.js/blob/master/mustache.js
    map : function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    },
    collect_geometries : function(geometries) {
      if (geometries.type == 'GeometryCollection')
        return geometries;
      return [{"type" : "GeometryCollection", "geometries" : geometries }]
    },
    collect_features : function(features){
      if (features.type == 'FeatureCollection')
        return features;
      return { "type" : "FeatureCollection", "features" : GeoJSON.map(features, function(feature){return {"geometry" : feature}})}
    },
    feature_collection_for : function(geojson) {
      return this.collect_features(this.collect_geometries(geojson));
    },
    
    Vector: function(x, y) {
      this.x = x;
      this.y = y;

      this.scalarMult = function(scalar) {
    	  return new GeoJSON.Vector(this.x * scalar, this.y * scalar);
      }
      this.dot = function(v2) {
        return this.x * v2.x + this.y * v2.y;
      };
      this.perp = function() {
        return new GeoJSON.Vector(-1 * this.y, this.x);
      };
      this.subtract = function(v2) {
        return this.add(v2.scalarMult(-1));
      };
      this.add = function(v2) {
    	  return new GeoJSON.Vector(this.x + v2.x, this.y + v2.y);
      }
    },

    Segment: function(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
    },

    cross: function(v1, v2) {
    	return v1.x * v2.y - v2.x * v1.y;
    },

    epsilon: 10e-6,
    doesnt_intersect: 0,
    parallel_doesnt_intersect: 1,
    colinear_doesnt_intersect: 2,
    intersect: 3,
    colinear_intersect: 4,

    lineIntersect: function(seg1, seg2, intersectionPoint) {
    	p = seg1.p1;
    	r = seg1.p2.subtract(seg1.p1);
    	q = seg2.p1;
    	s = seg2.p2.subtract(seg2.p1);
    	rCrossS = GeoJSON.cross(r, s);
    	if(rCrossS <= GeoJSON.epsilon && rCrossS >= -1 * GeoJSON.epsilon){
    		return GeoJSON.parallel_doesnt_intersect;
    	}
    	t = GeoJSON.cross(q.subtract(p), s)/rCrossS;
    	u = GeoJSON.cross(q.subtract(p), r)/rCrossS;
    	if(0 <= u && u <= 1 && 0 <= t && t <= 1){
    		intPoint = p.add(r.scalarMult(t));
    		intersectionPoint.x = intPoint.x;
    		intersectionPoint.y = intPoint.y;
    		return GeoJSON.intersect;
    	}else{
    		return GeoJSON.doesnt_intersect;
    	}
    },

    polygonsIntersect: function(pol1, pol2) {
      //todo: make this not suck, written after not sleeping for 24 hours
      for(var x = 0; x < pol1.coordinates.length; x++) {
        for(var y = 0; y < pol2.coordinates.length; y++) {
          if (y === pol2.coordinates.length-1 && x !== pol1.coordinates.length-1) {
            var xa1 = pol1.coordinates[x][0];
            var ya1 = pol1.coordinates[x][1];
            var xa2 = pol1.coordinates[x+1][0];
            var ya2 = pol1.coordinates[x+1][1];
            var xb1 = pol2.coordinates[y][0];
            var yb1 = pol2.coordinates[y][1];
            var xb2 = pol2.coordinates[0][0];
            var yb2 = pol2.coordinates[0][1];
          } else if (x === pol1.coordinates.length-1 && y !== pol2.coordinates.length-1){
            var xa1 = pol1.coordinates[x][0];
            var ya1 = pol1.coordinates[x][1];
            var xa2 = pol1.coordinates[0][0];
            var ya2 = pol1.coordinates[0][1];
            var xb1 = pol2.coordinates[y][0];
            var yb1 = pol2.coordinates[y][1];
            var xb2 = pol2.coordinates[y+1][0];
            var yb2 = pol2.coordinates[y+1][1];
          } else if (x === pol1.coordinates.length-1 && y === pol2.coordinates.length-1){
            var xa1 = pol1.coordinates[x][0];
            var ya1 = pol1.coordinates[x][1];
            var xa2 = pol1.coordinates[0][0];
            var ya2 = pol1.coordinates[0][1];
            var xb1 = pol2.coordinates[y][0];
            var yb1 = pol2.coordinates[y][1];
            var xb2 = pol2.coordinates[0][0];
            var yb2 = pol2.coordinates[0][1];
          } else {
            var xa1 = pol1.coordinates[x][0];
            var ya1 = pol1.coordinates[x][1];
            var xa2 = pol1.coordinates[x+1][0];
            var ya2 = pol1.coordinates[x+1][1];
            var xb1 = pol2.coordinates[y][0];
            var yb1 = pol2.coordinates[y][1];
            var xb2 = pol2.coordinates[y+1][0];
            var yb2 = pol2.coordinates[y+1][1];
          }
          var seg1 = new GeoJSON.Segment(new GeoJSON.Vector(xa1, ya1), new GeoJSON.Vector(xa2, ya2));
          var seg2 = new GeoJSON.Segment(new GeoJSON.Vector(xb1, yb1), new GeoJSON.Vector(xb2, yb2));
          var intersectionPoint = new GeoJSON.Vector(0, 0);
          if(GeoJSON.lineIntersect(seg1, seg2, intersectionPoint) == GeoJSON.intersect) {
        	  return true;
          }
        }
      }
      return false;
    }
  };
}();