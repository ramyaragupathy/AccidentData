'use strict';

var cover = require('tile-cover');
var tilebelt = require('tilebelt');
var turf = require('@turf/turf');

module.exports = function (data, tile, writeData, done) {
    var totalAccidents;
    var totalFatalities = 0;
    if (data.accidents.accidents.features) {
        totalAccidents = data.accidents.accidents.features.length;

        data.accidents.accidents.features.forEach(function (accident) {
            totalFatalities += accident.properties.fatalities;
        });
    }

    data.highways.highway.features.forEach(function (highwayFeature) {
        highwayFeature.properties.totalAccidents = totalAccidents;
        highwayFeature.properties.totalFatalities = totalFatalities;
    });


    var tileHash = {};

    data.highways.highway.features.forEach(function (feature) {
        for (var z = 4; z <= 12; z++) {
            var tiles = cover.tiles(feature.geometry, {'min_zoom': z, 'max_zoom': z});
            tiles.forEach(function (tile) {
                // convert tile to a string to use as a key
                tileHash[tile.join('/')] = 1;
            });
        }
    });

    Object.keys(tileHash).forEach(function (key) {
        // convert key back to a tile array
        var tile = key.split('/').map(Number);
        // convert tile to geojson geometry, then wrap in a geojson polygon feature
        var box = turf.polygon(tilebelt.tileToGeoJSON(tile).coordinates);
        writeData(JSON.stringify(box));
    });
    // writeData(data.highways.highway.features);
    done(null, null);
};
