#!/usr/bin/env node
'use strict';
var tileReduce = require('tile-reduce');
var path = require('path');

tileReduce({
    zoom: 12,
    map: path.join(__dirname, 'map.js'),
    sources: [{name: 'tampa', mbtiles: '../tampa.mbtiles'}, {name: 'accidents', mbtiles: '../accidents.mbtiles'}]
})
.on('reduce', function (id) {
})
.on('end', function () {
});
