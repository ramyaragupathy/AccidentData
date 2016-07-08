var Parser = require('dbf-parser');
var parser = new Parser('./fars/2014/DBF/FARS2014/accident.dbf');
var day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var tempJSON ={
  'type': 'FeatureCollection',
  'features': []
};

parser.on('start', function(p) {
    // console.log('dBase file parsing has started');
});

parser.on('header', function(h) {
    // console.log('dBase file header has been parsed');
});

parser.on('record', function(record) {
  var featureJSON = {
    'type': 'Feature',
    'properties': {},
    'geometry': {
      'coordinates': [],
      'type': 'Point'
    }
  };
  if (record['LONGITUD'] == 999.9999 ||record['LONGITUD'] == 888.8888 ||record['LONGITUD'] == 777.7777 || 
  	 record['LONGITUD'] == 99.99|| record['LONGITUD'] == 88.88 || 
  	 record['LONGITUD'] == 99|| record['LONGITUD'] == 88 ||
  	 record['LATITUDE']== 99.99||record['LATITUDE']== 88.88 || record['LATITUDE']== 77.77 ||
  	  record['LATITUDE']== 99||record['LATITUDE']== 88 ) {
  	// console.log('no geometry');

  } else {
  	// console.log('valid geometry');
    featureJSON.geometry.coordinates[0] = record['LONGITUD'];
    featureJSON.geometry.coordinates[1] = record['LATITUDE'];
    featureJSON.properties['state'] = record['STATE'];
    featureJSON.properties['crashNum'] = record['ST_CASE'];
    featureJSON.properties['date'] = record['DAY'] + '-' +record['MONTH']+'-'+ record['YEAR'];
    featureJSON.properties['day'] = record['DAY_WEEK'];
    // featureJSON.properties['date'] = record['DAY']+record['MONTH']+record['YEAR'];
    tempJSON.features.push(featureJSON); 
  }

});

parser.on('end', function(p) {
    // console.log('Finished parsing the dBase file');
    console.log(JSON.stringify(tempJSON));
     // console.log(tempJSON.features.length);
        // Name: John Smith

  tempJSON.features.forEach(function(item){
  

  	// item.geometry.coordinates[1] = item.properties['LATITUDE'];
  	// item.geometry.coordinates[0] = item.properties['LONGITUD'];
    // console.log('success');
  });
});

parser.parse();



