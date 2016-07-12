'use strict';
var accidentJSON = require('./2010-14Intersections.json');

mapboxgl.accessToken = 'pk.eyJ1IjoicmFteWFyYWd1cGF0aHkiLCJhIjoiOHRoa2JJTSJ9.6Y38XMOQL80LZyrUAjXgIg';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramyaragupathy/ciqj9b155001pbfnjne0339ez', //stylesheet location
    center: [27.33, 27.73], // starting position
    hash: true
});

var accident = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': accidentJSON,
     cluster: true,
     clusterMaxZoom: 22, // Max zoom to cluster points on
     clusterRadius: 100
});

// //what to do while loading map style
map.on('style.load', function () {
    map.addSource('accidentSource',accident);

    map.addLayer({
        'id': 'accident',
        'type': 'circle',
        'source': 'accidentSource',
        'layout': {
            visibility: 'visible'
        },
        'paint': {
          'circle-color': 'red',
          'circle-radius': 8,
          'circle-opacity': .8, 
          'circle-blur':2
      
        }
    }); 
    var layers = [
        [150, 'red'],
        [20, 'red'],
        [0, 'red']
    ];

    layers.forEach(function (layer, i) {
        map.addLayer({
            "id": "cluster-" + i,
            "type": "circle",
            "source": "accidentSource",
            "paint": {
                "circle-color": layer[1],
                "circle-radius": 18
            },
            "filter": i === 0 ?
                [">=", "point_count", layer[0]] :
                ["all",
                    [">=", "point_count", layer[0]],
                    ["<", "point_count", layers[i - 1][0]]]
        });
    });

    // Add a layer for the clusters' count labels
    map.addLayer({
        "id": "cluster-count",
        "type": "symbol",
        "source": "accidentSource",
        "layout": {
            "text-field": "{point_count}",
            "text-font": [
                "DIN Offc Pro Medium",
                "Arial Unicode MS Bold"
            ],
            "text-size": 12
        }
    });
});