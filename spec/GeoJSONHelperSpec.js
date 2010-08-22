describe("GeoJSON utility functions", function() {
  describe("#polygonsIntersect", function() {
    it("should detect polygons that intersect", function() {
      var intersecting1 = {"type":"Polygon","coordinates":[[-122.34100341796875,47.739446498637776],[-122.5030517578125,47.60258275608435],[-122.39593505859375,47.492276537740416],[-122.1844482421875,47.51732435953473],[-122.23663330078125,47.72097237165927],[-122.34100341796875,47.739446498637776]]};
      var intersecting2 = {"type":"Polygon","coordinates":[[-122.23388671875,47.80036462595262],[-122.3162841796875,47.688626879942966],[-122.14187622070312,47.576649235558236],[-122.04437255859375,47.75422108200102],[-122.091064453125,47.782834903292276],[-122.23388671875,47.80036462595262]]};
      var not_intersecting = {"type":"Polygon","coordinates":[[-122.48931884765625,47.86950316614039],[-122.80517578125,47.655336290758285],[-122.63763427734375,47.60258275608435],[-122.35061645507812,47.86766066723359],[-122.48931884765625,47.86950316614039]]};
      
      expect(GeoJSON.polygonsIntersect(intersecting1, intersecting2)).toBeTruthy();
      expect(GeoJSON.polygonsIntersect(intersecting1, not_intersecting)).toBeFalsy();
    });
  });
  describe("#collect_geometries", function() {
    it("should wrap geometries in a geometry collection", function() {
      var points = [{"coordinates" : [-122.672727,45.521561], "type" : "Point"}, 
                    {"coordinates" : [-122.675647,45.523729], "type" : "Point"}];
      var geometry_collection = [{"type" : "GeometryCollection", "geometries" : points }];
      expect(GeoJSON.collect_geometries(points)).toEqual(geometry_collection);
    });

    it("shouldn't alter existing geometry collections", function() {
      var geometry_collection = { "type" : "GeometryCollection",
                              "geometries" : [
                                { "coordinates" : [-122.672727,45.521561], "type" : "Point" },
                                { "coordinates" : [-122.675647,45.523729], "type" : "Point" }
                              ]
                            }
      expect(GeoJSON.collect_geometries(geometry_collection)).toEqual(geometry_collection);
    });
  });

  describe("#collect_features", function() {
    it("should wrap geometry collections in a feature collection", function() {
      var geometry_collections = [{"type" : "GeometryCollection", 
                               "geometries" : 
                                 [{"type":"LineString",
                                   "coordinates" : [[-122.593225, 45.563783], [-122.592189, 45.563325]]
                                 }]
                              },
                              {"type" : "GeometryCollection", 
                                 "geometries" : 
                                   [{"type":"LineString",
                                      "coordinates" : [[-122.593225, 45.563783], [-122.592189, 45.563325]]
                                   }]
                             }]
      var feature_collection = {"type" :  "FeatureCollection", 
                            "features" : [{"geometry" : geometry_collections[0]}, {"geometry" : geometry_collections[1]}]
                           }
      expect(GeoJSON.collect_features(geometry_collections)).toEqual(feature_collection);
    });

    it("shouldn't alter existing feature collections", function() {
      feature = { "type" : "FeatureCollection",
                  "features" : [{"geometry" : 
                    { "type" : "GeometryCollection",
                      "geometries" : [
                        { "coordinates" : [-122.672727,45.521561], "type" : "Point" },
                        { "coordinates" : [-122.675647,45.523729], "type" : "Point" }
                      ]
                    }}
                  ]
                }
      expect(GeoJSON.collect_features(feature)).toEqual(feature);
    });
  });
  
  describe("#feature_collection_for", function() {
    it("should convert arbitrary arrays of individual GeoJSON objects into a feature collection", function() {
      var points = [{"coordinates" : [-122.672727,45.521561],"type" : "Point"}, 
                    {"coordinates" : [-122.675647,45.523729],"type" : "Point"}]
      expect(GeoJSON.feature_collection_for(points)).toEqual(
        { "type" : "FeatureCollection",
          "features" : [{"geometry" : 
            { "type" : "GeometryCollection",
              "geometries" : [
                { "coordinates" : [-122.672727,45.521561], "type" : "Point" },
                { "coordinates" : [-122.675647,45.523729], "type" : "Point" }
              ]
            }}
          ]
        }
      );
    });
  }); 
});