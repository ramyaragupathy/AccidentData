mapboxgl.accessToken = 'pk.eyJ1IjoicmFteWFyYWd1cGF0aHkiLCJhIjoiOHRoa2JJTSJ9.6Y38XMOQL80LZyrUAjXgIg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v8',
    center: [-98.995, 39.933],
    zoom: 4,
    minZoom: 4,
    hash: true
});

map.addControl(new mapboxgl.Navigation({
    position: 'bottom-right'
}));

//globals
var BUFFER_RADIUS = 500;
var PREVIOUS_SLIDER_VALUE = 1;
var mousePoint;
var bufferSource;

//add a credit link on the bottom right.
var credit = document.createElement('a');
credit.href = 'http://www.nhtsa.gov/FARS';
credit.className = 'fill-darken2 pad0x inline fr color-white';
credit.target = '_target';
credit.textContent = 'Data provided by NHTSA';
map.getContainer().querySelector('.mapboxgl-ctrl-bottom-right').appendChild(credit);

document.getElementById('slider').addEventListener('input', function (e) {
    BUFFER_RADIUS += (parseInt(e.target.value) - PREVIOUS_SLIDER_VALUE) * 100;
    PREVIOUS_SLIDER_VALUE = parseInt(e.target.value);
    if (map.getZoom()>=11){setBufferAndFilterFeatures(BUFFER_RADIUS);}
});

map.on('load', function () {
    //add fars style and create fars layer
    map.addSource('allIntersections', {
        type: 'vector',
        url: 'mapbox://ramyaragupathy.d1ohq9ha'
    });
    map.addSource('noIntersections', {
        type: 'vector',
        url: 'mapbox://ramyaragupathy.9u2tkws7'
    });

    map.addLayer({
            "id": "All grey",
            "type": "circle",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "hsl(1, 27%, 52%)",
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0.3
                        ],
                        [
                            9,
                            0
                        ]
                    ]
                },
                "circle-blur": 0,
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            2
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            15,
                            12
                        ]
                    ]
                }
            }
        });
       map.addLayer({
            "id": "Other Intersection (Dot)",
            "type": "circle",
            "metadata": {},
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "!in",
                "intersection",
                "Four-Way Intersection",
                "T-Intersection",
                "Y-Intersection"
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "hsl(329, 70%, 63%)",
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0
                        ],
                        [
                            9,
                            0.3
                        ],
                        [
                            11,
                            0.5
                        ]
                    ]
                },
                "circle-blur": 0,
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            2
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            15,
                            12
                        ]
                    ]
                }
            }
        });
        map.addLayer({
            "id": "Other Intersection (Symbol)",
            "type": "symbol",
            "metadata": {},
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "!in",
                "intersection",
                "Four-Way Intersection",
                "T-Intersection",
                "Y-Intersection"
            ],
            "layout": {
                "text-field": "*",
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            10
                        ],
                        [
                            22,
                            18
                        ]
                    ]
                },
                "text-offset": [
                    0,
                    0.2
                ]
            },
            "paint": {
                "text-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            11,
                            0
                        ],
                        [
                            11.5,
                            1
                        ]
                    ]
                },
                "text-color": "hsl(329, 42%, 23%)"
            }
        });
        map.addLayer({
            "id": "4 Way Intersection (Dot)",
            "type": "circle",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "Four-Way Intersection"
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "#d95f02",
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0
                        ],
                        [
                            9,
                            0.3
                        ],
                        [
                            11,
                            0.5
                        ]
                    ]
                },
                "circle-blur": 0,
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            2
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            15,
                            12
                        ]
                    ]
                }
            }
        });
        map.addLayer({
            "id": "4 Way Intersection (Symbol)",
            "type": "symbol",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "Four-Way Intersection"
            ],
            "layout": {
                "text-field": "+",
                "visibility": "visible",
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            9
                        ],
                        [
                            15,
                            16
                        ]
                    ]
                },
                "text-allow-overlap": false
            },
            "paint": {
                "text-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            11,
                            0
                        ],
                        [
                            11.5,
                            1
                        ]
                    ]
                },
                "text-color": "hsl(26, 98%, 27%)"
            }
        });
        map.addLayer({
            "id": "T Intersection (Dot)",
            "type": "circle",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "T-Intersection"
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "#7570b3",
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0
                        ],
                        [
                            9,
                            0.3
                        ],
                        [
                            11,
                            0.5
                        ]
                    ]
                },
                "circle-blur": 0,
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            2
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            15,
                            12
                        ]
                    ]
                }
            }
        });
        map.addLayer({
            "id": "T Intersection (Symbol)",
            "type": "symbol",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "T-Intersection"
            ],
            "layout": {
                "text-field": "T",
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            6
                        ],
                        [
                            22,
                            12
                        ]
                    ]
                },
                "text-allow-overlap": true
            },
            "paint": {
                "text-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            11,
                            0
                        ],
                        [
                            11.5,
                            1
                        ]
                    ]
                },
                "text-color": "hsl(244, 36%, 26%)"
            }
        });
        map.addLayer({
            "id": "Y Intersection (Dot)",
            "type": "circle",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "Y-Intersection"
            ],
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-color": "#1b9e77",
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            2
                        ],
                        [
                            10,
                            4
                        ],
                        [
                            15,
                            12
                        ]
                    ]
                },
                "circle-blur": 0,
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0
                        ],
                        [
                            9,
                            0.3
                        ],
                        [
                            11,
                            0.5
                        ]
                    ]
                }
            }
        });
        map.addLayer({
            "id": "Y Intersection (Symbol)",
            "type": "symbol",
            "source": "allIntersections",
            "source-layer": "farsz20",
            "interactive": true,
            "filter": [
                "==",
                "intersection",
                "Y-Intersection"
            ],
            "layout": {
                "text-field": "Y",
                "text-size": {
                    "base": 1,
                    "stops": [
                        [
                            8,
                            6
                        ],
                        [
                            22,
                            12
                        ]
                    ]
                },
                "text-allow-overlap": true
            },
            "paint": {
                "text-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            11,
                            0
                        ],
                        [
                            11.5,
                            1
                        ]
                    ]
                },
                "text-color": "hsl(162, 72%, 17%)"
            }
        });
        map.addLayer({
            "id": "No Intersection",
            "type": "circle",
            "metadata": {},
            "source": "noIntersections",
            "source-layer": "farsz20_NI",
            "interactive": true,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "circle-radius": {
                    "base": 1,
                    "stops": [
                        [
                            4,
                            1.5
                        ],
                        [
                            10,
                            3
                        ],
                        [
                            15,
                            6
                        ]
                    ]
                },
                "circle-color": "hsl(66, 10%, 47%)",
                "circle-opacity": {
                    "base": 1,
                    "stops": [
                        [
                            8.9,
                            0
                        ],
                        [
                            9,
                            0.3
                        ],
                        [
                            11,
                            0.5
                        ]
                    ]
                },
                "circle-blur": 0
            }
        });

    //create buffer source and buffer layer
    bufferSource = new mapboxgl.GeoJSONSource({
        data: {
            'type': 'FeatureCollection',
            'features': []
        }
    });
    map.addSource('bufferSource', bufferSource);
    map.addLayer({
        id: 'buffer',
        interactive: true,
        type: 'fill',
        source: 'bufferSource',

        paint: {
            'fill-color': '#555',
            'fill-opacity': 0.1,
            'fill-outline-color': '#000000'
        }
    });

    map.on('click', function (e) {
        mousePoint = e;
        if (map.getZoom()>=11){
            
            console.log('buffer radius ' + BUFFER_RADIUS);
            setBufferAndFilterFeatures(BUFFER_RADIUS);
        }
        
    });

    map.on('mousemove', function (e) {
        
        if (map.getZoom()>=11){
            console.log("z greater than 11");
            document.getElementById('sidebar').style.display ='block';
        } else{
            console.log("z less than 11");
            map.setFilter('All grey', [">", "year", 2009]);
            map.setFilter('Other Intersection (Dot)', ["!in","intersection","Four-Way Intersection","T-Intersection","Y-Intersection"]);
            map.setFilter('Other Intersection (Symbol)', ["!in","intersection","Four-Way Intersection","T-Intersection","Y-Intersection"]);
            map.setFilter('4 Way Intersection (Dot)', ["==","intersection","Four-Way Intersection"]);
            map.setFilter('4 Way Intersection (Symbol)', ["==","intersection","Four-Way Intersection"]);
            map.setFilter('T Intersection (Dot)', ["==","intersection", "T-Intersection"]);
            map.setFilter('T Intersection (Symbol)', ["==","intersection", "T-Intersection"]);
            map.setFilter('Y Intersection (Dot)', ["==","intersection", "Y-Intersection"]);
            map.setFilter('Y Intersection (Symbol)', ["==","intersection", "Y-Intersection"]);
            map.setFilter('No Intersection', [">", "year", 2009]);
            document.getElementById('sidebar').style.display ='none';
        }
        
    });

});

function setBufferAndFilterFeatures(radius) {
    var filterFeatures = ['any'];
    var fatalities=0, intersectionAccidentsCount=0, nonIntersectionAccidentsCount=0, intersectionFatalitiesCount=0, nonIntersectionFatalitiesCount = 0;

    var point = turf.point([mousePoint.lngLat.lng, mousePoint.lngLat.lat]);

    var buffer = turf.buffer(point, radius, 'meters');
    bufferSource.setData(buffer);

    var intersectionFeatures = map.querySourceFeatures('allIntersections', {sourceLayer: 'farsz20'});
    var nonIntersectionFeatures = map.querySourceFeatures('noIntersections', {sourceLayer: 'farsz20_NI'});
    var allTileFeatures = intersectionFeatures.concat(nonIntersectionFeatures);
    console.log(allTileFeatures.length);

    var featuresInBuffer = turf.within(turf.featureCollection(allTileFeatures), turf.featureCollection([buffer]));
    var divContent ='<h3>Accidents at Intersections:</h3><ul id="intersection-list">';
    featuresInBuffer.features.forEach(function (item) {
        fatalities = fatalities + item.properties.fatalities;
        if (item.properties.intersection !='Not an Intersection'){

            divContent = divContent + '<li class="keyline-bottom" onclick = "map.flyTo({center: ['+item.geometry.coordinates[0]+ ','+ item.geometry.coordinates[1]+'], zoom: 20});">'+item.properties.intersection+'</li>'
            intersectionAccidentsCount = intersectionAccidentsCount + 1;
            intersectionFatalitiesCount = intersectionFatalitiesCount + item.properties.fatalities;

        } else{

            nonIntersectionAccidentsCount = nonIntersectionAccidentsCount+1;
            nonIntersectionFatalitiesCount = nonIntersectionFatalitiesCount + item.properties.fatalities;

        }


        filterFeatures.push([
            'all',
            ['==', 'crashNum', item.properties.crashNum],
            ['==', 'year', item.properties.year]
        ]);
    });
    divContent+="</ul>";
    var accidentDetails = document.createElement('div');
    accidentDetails.innerHTML = divContent;
    accidentDetails.id = 'accidentDetails';
    document.getElementById('accidentSummary').innerHTML = "<div id='accidentTotals'><h3>Accident Summary:</h3>"+ 
                                                           "<dl>" + 
                                                           "<dt>Total number of accidents: </dt><dd>" + featuresInBuffer. features.length + '</dd></br>'+
                                                           "<dt>Total number of fatalities: </dt><dd>" + fatalities+'</dd></br>'+
                                                           "<dt>Accident at intersections: </dt><dd>" + intersectionAccidentsCount+'</dd></br>'+
                                                           "<dt>Accident at non-intersections: </dt><dd>" + nonIntersectionAccidentsCount+'</dd></br></dl></div>';
    document.getElementById('accidentSummary').appendChild(accidentDetails)
                                                    

    map.setFilter('All grey', filterFeatures);
    map.setFilter('Other Intersection (Dot)', ['all',["!in","intersection","Four-Way Intersection","T-Intersection","Y-Intersection"],filterFeatures]);
    map.setFilter('Other Intersection (Symbol)', ['all',["!in","intersection","Four-Way Intersection","T-Intersection","Y-Intersection"],filterFeatures]);
    map.setFilter('4 Way Intersection (Dot)', ['all',["==","intersection","Four-Way Intersection"],filterFeatures]);
    map.setFilter('4 Way Intersection (Symbol)', ['all',["==","intersection","Four-Way Intersection"],filterFeatures]);
    map.setFilter('T Intersection (Dot)', ['all',["==","intersection", "T-Intersection"],filterFeatures]);
    map.setFilter('T Intersection (Symbol)', ['all',["==","intersection", "T-Intersection"],filterFeatures]);
    map.setFilter('Y Intersection (Dot)', ['all',["==","intersection", "Y-Intersection"],filterFeatures]);
    map.setFilter('Y Intersection (Symbol)', ['all',["==","intersection", "Y-Intersection"],filterFeatures]);
    map.setFilter('No Intersection', filterFeatures);

}
