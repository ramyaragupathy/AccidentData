'use strict';
var accidentJSON = require('./2010-14Intersections.json');
var fatalities;

mapboxgl.accessToken = 'pk.eyJ1IjoicmFteWFyYWd1cGF0aHkiLCJhIjoiOHRoa2JJTSJ9.6Y38XMOQL80LZyrUAjXgIg';

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/ramyaragupathy/ciqj9b155001pbfnjne0339ez', //stylesheet location
    center: [27.33, 27.73], // starting position
    hash: true
});

var accident = new mapboxgl.GeoJSONSource({
    'type': 'geojson',
    'data': accidentJSON
    
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
 
