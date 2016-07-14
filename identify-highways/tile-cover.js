'use strict';

var cover = require('tile-cover');
var fs = require('fs');
var poly = JSON.parse(fs.readFileSync('./poly.geojson'));
var limits = {
    min_zoom: 1,
    max_zoom: 12
};

cover.geojson(poly.geom, limits);
cover.tiles(poly.geom, limits);
cover.indexes(poly.geom, limits);
