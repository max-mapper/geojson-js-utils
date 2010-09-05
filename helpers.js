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
    }
  };
}();