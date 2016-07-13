'use strict';
var accidentJSON = require('./2010-14Intersections.json');
var fatalities;

mapboxgl.accessToken = 'pk.eyJ1IjoicmFteWFyYWd1cGF0aHkiLCJhIjoiOHRoa2JJTSJ9.6Y38XMOQL80LZyrUAjXgIg';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramyaragupathy/ciqj9b155001pbfnjne0339ez', //stylesheet location
    center: [27.33, 27.73], // starting position
    hash: true,
    boxZoom:true
});
map.addControl(new mapboxgl.Navigation({position: 'bottom-left'}));

var onemoremap = new mapboxgl.Map({
    container: 'onemoremap', // container id
    style: 'mapbox://styles/ramyaragupathy/ciqj9b155001pbfnjne0339ez', //stylesheet location
    center: [27.33, 27.73], // starting position
    hash: true,
    boxZoom:true
});
onemoremap.addControl(new mapboxgl.Navigation({position: 'bottom-left'}));
var accident = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': accidentJSON
    
});

var accidentCluster = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': accidentJSON,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50
    
});

 // Radius of each cluster when clustering points (defaults to 50)
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
          'circle-color': {
           property: 'fatalities',
           stops: [
              
              [1, '#ffb1b1'],
              [2,'#ff6262'],
              [5, '#ff1414'],
              [10, '#b10000']
              

            ]},
         
          'circle-radius': {
           property: 'fatalities',
           stops: [
            [1,  6],
            [2, 12],
            [5, 20],
            [10, 25],
            [20, 30]
  

            
           ]},
           'circle-blur':1,
           'circle-opacity':.8
       
          
      
        }
       
                 
    }); 
    
});
onemoremap.on('style.load', function () {
    onemoremap.addSource('accidentSource',accidentCluster);

    onemoremap.addLayer({
        'id': 'accident',
        'type': 'circle',
        'source': 'accidentSource',
        'layout': {
            visibility: 'visible'
        },
        'paint': {
          'circle-color': 'red',
           'circle-blur':1,
           'circle-opacity':.8
       
          
      
        }
       
                 
    }); 

    var layers = [
        [150, '#f28cb1'],
        [20, '#f1f075'],
        [0, '#51bbd6']
    ];

    layers.forEach(function (layer, i) {
        onemoremap.addLayer({
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
    onemoremap.addLayer({
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
var popup = new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: true
});
map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
            layers: ['accident']
        });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    if (!features.length) {
        popup.remove();
        return;
    }


          var popupHTML = 'Number of fatalities: ' + '<b>'+features[0].properties.fatalities +'</b>'+'</h5>';

          popup = new mapboxgl.Popup()
                .setLngLat(features[0].geometry.coordinates)
                .setHTML(popupHTML)
                .addTo(map);
    
});
map.on('zoom', function (e) {
    onemoremap.setZoom(map.getZoom()) ;
    onemoremap.setCenter(map.getCenter());


    
});
map.on('drag', function (e) {
    onemoremap.setCenter(map.getCenter());
    
});


onemoremap.on('zoom', function (e) {
    map.setZoom(onemoremap.getZoom()) ;
    map.setCenter(onemoremap.getCenter());

    
});
onemoremap.on('drag', function (e) {
    map.setCenter(onemoremap.getCenter());

    
});


 
