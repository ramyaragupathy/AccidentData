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

    data.tampa.tampa.features.forEach(function (tampaFeature) {
        tampaFeature.properties.totalAccidents = totalAccidents;
        tampaFeature.properties.totalFatalities = totalFatalities;
    });

    writeData(data.tampa.tampa.features);
    done(null, null);
};
