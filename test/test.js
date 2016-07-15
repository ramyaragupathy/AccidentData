var cover = require('tile-cover');
var tilebelt = require('tilebelt');
var turf = require('@turf/turf');

var features = [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          76.640625,
          23.241346102386135
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              75.498046875,
              29.611670115197406
            ],
            [
              75.498046875,
              31.728167146023935
            ],
            [
              78.92578124999999,
              31.728167146023935
            ],
            [
              78.92578124999999,
              29.611670115197406
            ],
            [
              75.498046875,
              29.611670115197406
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            52.64648437499999,
            33.87041555094183
          ],
          [
            47.63671875,
            28.613459424004414
          ]
        ]
      }
    }
  ]

// use a hashmap to keep tiles unique
var tileHash = {}

features.forEach(function(feature){
  for(var z = 4; z <= 14; z++) {
    var tiles = cover.tiles(feature.geometry, {min_zoom: z, max_zoom: z})
    tiles.forEach(function(tile){
      // convert tile to a string to use as a key
      tileHash[tile.join('/')] = 1
    });
  }
});

// console.log(tileHash);

Object.keys(tileHash).forEach(function(key){
  // convert key back to a tile array
  var tile = key.split('/').map(Number);
  // convert tile to geojson geometry, then wrap in a geojson polygon feature
  var box = turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates)
  console.log(JSON.stringify(box))
});
