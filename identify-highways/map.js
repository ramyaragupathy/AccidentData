'use strict';

var cover = require('tile-cover');
var tilebelt = require('tilebelt');
var turf = require('@turf/turf');

module.exports = function (data, tile, writeData, done) {
    var disasters = [ "drought", "flood", "heavy-rain", "pests-and-diseases", "extreme-temperatures", "storms", "geophysical", "post-harvest-damages", "humidity-change"];
    var tileHash = {};

    data.counties.counties.features.forEach(function(county)) {
      data.farms.yodahe.features.forEach(function (feature) {
          for (var z = 8; z <= 12; z++) {
              feature.properties.allDisasters = 0
              for (var i = 0; i < disasters.length; i ++) {
                  feature.properties.allDisasters += feature.properties[disasters[i]]
              }
              var tiles = cover.tiles(feature.geometry, {'min_zoom': z, 'max_zoom': z});
              tiles.forEach(function (tile) {
                  // convert tile to a string to use as a key
                  tileHash[tile.join('/')] = feature.properties;
              });
          }
      });
    }

    Object.keys(tileHash).forEach(function (key) {
        // convert key back to a tile array
        var tile = key.split('/').map(Number);
        // writeData(tileHash[key])
        // convert tile to geojson geometry, then wrap in a geojson polygon feature
        var box = turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates, tileHash[key]);
        writeData(JSON.stringify(box));
    });
    // writeData(data.highways.highway.features);
    done(null, null);
};
