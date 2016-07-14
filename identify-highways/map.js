'use strict';

// var fs = require('fs');
// var ff = require('feature-filter');
// var featureCollection = require('turf-featurecollection');

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

    writeData(data.highways.highway.features);
    done(null, null);
};
