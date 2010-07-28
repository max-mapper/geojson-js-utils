describe("GeoJSONHelper utility functions", function() {
	describe("#collect_geometries", function() {
	  it("should wrap geometries in a geometry collection", function() {
	    var points = [{"coordinates" : [-122.672727,45.521561], "type" : "Point"}, 
					  	      {"coordinates" : [-122.675647,45.523729], "type" : "Point"}];
	    var geometry_collection = [{"type" : "GeometryCollection", "geometries" : points }];
	    expect(GeoJSONHelper.collect_geometries(points)).toEqual(geometry_collection);
	  });

	  it("shouldn't alter existing geometry collections", function() {
		  var geometry_collection = { "type" : "GeometryCollection",
		                          "geometries" : [
		                            { "coordinates" : [-122.672727,45.521561], "type" : "Point" },
		                            { "coordinates" : [-122.675647,45.523729], "type" : "Point" }
		                          ]
		                        }
	    expect(GeoJSONHelper.collect_geometries(geometry_collection)).toEqual(geometry_collection);
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
	    expect(GeoJSONHelper.collect_features(geometry_collections)).toEqual(feature_collection);
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
	    expect(GeoJSONHelper.collect_features(feature)).toEqual(feature);
		});
	});
	
	describe("#feature_collection_for", function() {
	  it("should convert arbitrary arrays of individual GeoJSONHelper objects into a feature collection", function() {
	    var points = [{"coordinates" : [-122.672727,45.521561],"type" : "Point"}, 
                	  {"coordinates" : [-122.675647,45.523729],"type" : "Point"}]
	    expect(GeoJSONHelper.feature_collection_for(points)).toEqual(
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