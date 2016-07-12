var Parser = require('dbf-parser');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var accidentParser = new Parser('./fars/'+argv.year+'/DBF/FARS'+argv.year+'/accident.dbf');
var vehicleParser = new Parser('./fars/'+argv.year+'/DBF/FARS'+argv.year+'/vehicle.dbf');
var personParser = new Parser('./fars/'+argv.year+'/DBF/FARS'+argv.year+'/person.dbf');

var data;
var day = {'1':'Sunday', '2':'Monday', '3':'Tuesday','4':'Wednesday', '5':'Thursday', '6':'Friday','7':'Saturday'};
var vehicleMake ={'1':'American Motors', '2':'Jeep/Kaiser-Jeep/Willys Jeep', '3':'AM General',
                  '6':'Chrysler', '7':'Dodge','8':'Imperial', '9':'Plymouth', '10':'Eagle', '12':'Ford', 
                  '13':'Lincoln', '14':'Mercury', '18':'Buick/Opel', '19':'Cadillac', '20':'Chevrolet', 
                  '21':'Oldsmobile', '22':'Pontiac', '23':'GMC', '24':'Saturn', '25':'Grumman','26':'Coda',
                  '29':'Other Domestic', '30':'Volkswagen', '31':'Alfa Romeo', '32':'Audi', '33':'Austin/Austin Healey',
                  '34':'BMW', '35':'Datsun/Nissan', '36':'Fiat', '37':'Honda', '38':'Isuzu', '39':'Jaguar', 
                  '40':'Lancia', '41':'Mazda', '42':'Mercedes-Benz', '43':'MG', '44':'Peugeot', '45':'Porsche',
                  '46':'Renault', '47':'Saab', '48':'Subaru', '49':'Toyota', '50':'Triumph', '51':'Volvo', 
                  '52':'Mitsubishi', '53':'Suzuki', '54':'Acura','55':'Hyundai', '56':'Merkur', '57':'Yugo', 
                  '58':'Infiniti', '59':'Lexus', '60':'Daihatsu', '61':'Sterling', '62':'Land Rover', '63':'Kia',
                  '64':'Daewoo', '65':'Smart', '66':'Mahindra', '67':'Scion', '69':'Other Imports', '70':'BSA', 
                  '71':'Ducati', '72':'Harley-Davidson', '73':'Kawasaki', '74':'Moto Guzzi', '75':'Norton', '76':'Yamaha', 
                  '77':'Victory', '78':'Other Make Moped', '79':'Other Make Motored Cycle', '80':'Brockway', 
                  '81':'Diamond Reo/Reo', '82':'Freightliner', '83':'FWD', '84':'International Harvester/Navistar', 
                  '85':'Kenworth', '86':'Mack', '87':'Peterbilt', '88':'Iveco/Magirus', '89':'White/Autocar, White/GMC', 
                  '90':'Bluebird', '91':'Eagle Coach', '92':'Gillig', '93':'MCI', '94':'Thomas Built',
                  '97':'Not Reported', '98':'Other Make', '99':'Unknown Make'};
var intersection={'1':'Not an Intersection', '2':'Four-Way Intersection', '3': 'T-Intersection', 
                  '4' : 'Y-Intersection', '5':'Traffic Circle', '6':'Roundabout', '7':'Five-Point or More',
                  '10': 'L-Intersection', '98':'Not Reported', '99':'Unknown'};
var light ={'1':'Daylight', '2':'Dark - not lighted', '3':'Dark-lighted', '4':'Dawn', '5':'Dusk',
            '6':'Dark - unknown lighting', '7':'Other','8':'Not Reported','9':'Unknown'};
var weather ={'1':'Clear', '2':'Rain', '3':'Sleet, Hail', '4':'Snow', '5':'Fog, Smog, Smoke',
              '6':'Severe Crosswinds', '7':'Blowing sand, Soil, Dirt','8':'Other','10':'Cloudy',
              '11':'Blowing Snow', '12':'Freezing Rain or Drizzle', '98':'Not Reported', '99':'Unknown'};


var accidentJSON ={
  'type': 'FeatureCollection',
  'features': []
};



accidentParser.on('record', function(record) {
  var accidentFeatureJSON = {
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
  	  record['LATITUDE']== 99||record['LATITUDE']== 88 ||
      record['TYP_INT']===99 || record['TYP_INT']== 1||
      record['TYP_INT']===98)
       {
  	// console.log('no geometry');

  } else {
  	// console.log('valid geometry');
    accidentFeatureJSON.geometry.coordinates[0] = record['LONGITUD'];
    accidentFeatureJSON.geometry.coordinates[1] = record['LATITUDE'];
    accidentFeatureJSON.properties['state'] = record['STATE'];
    accidentFeatureJSON.properties['crashNum'] = record['ST_CASE'];
    accidentFeatureJSON.properties['date'] = record['DAY'] + '-' +record['MONTH']+'-'+ record['YEAR'];
    accidentFeatureJSON.properties['day'] = day[record['DAY_WEEK']];
    accidentFeatureJSON.properties['hour'] = record['HOUR'];
    accidentFeatureJSON.properties['minute']=record['MINUTE'];
    accidentFeatureJSON.properties['time'] = record['HOUR']+':'+record['MINUTE'];
    accidentFeatureJSON.properties['fatalities'] = record['FATALS'];
    accidentFeatureJSON.properties['vehicles involved'] = record['PVE_FORMS'];
    accidentFeatureJSON.properties['make'] =[];
    accidentFeatureJSON.properties['pedestrian'] = record['PEDS'];
    accidentFeatureJSON.properties['people not in vehicle'] =record['PERNOTMVIT'];
    accidentFeatureJSON.properties['people in vehicle']  = record['PERMVIT'];
    accidentFeatureJSON.properties['highway function'] = record['ROAD_FNC'];
    accidentFeatureJSON.properties['intersection'] = intersection[record['TYP_INT']];
    accidentFeatureJSON.properties['highway name'] = [record['TWAY_ID'],record['TWAY_ID2']];
    accidentFeatureJSON.properties['light condition'] = light[record['LGT_COND']];
    accidentFeatureJSON.properties['weather'] = [weather[record['WEATHER']],weather[record['WEATHER1']],weather[record['WEATHER2']]];
    accidentFeatureJSON.properties['drunk driver'] = record['DRUNK_DR'];
    accidentJSON.features.push(accidentFeatureJSON); 
  }

});
vehicleParser.on('record', function(record) {
  

  accidentJSON.features.forEach(function(item){
    if(record['ST_CASE'] == item.properties.crashNum){
      // if(item.properties['make'])
      // {

      // }

     item.properties.make.push(vehicleMake[record['MAKE']]);
     item.properties['number of lanes'] = record['VNUM_LAN'];
     item.properties['vehicle'] = record['BODY_TYP'];

    }
  
  });

});

// personParser.on('record', function(record) {
  

//   accidentJSON.features.forEach(function(item){
//     if(record['ST_CASE'] == item.properties.crashNum){
//       if (record['VEH_NO']==0){
//         if(item.properties.pedestrian >0){
//           item.properties.pedestrian =  item.properties.pedestrian + 1;
//         } else {
//           item.properties.pedestrian = 1;
//         }
        
//       }
//     }
  
//   });

 
// });

personParser.on('end', function(p) {
    // console.log('Finished parsing the dBase file');
    // console.log(JSON.stringify(vehicleJSON));
   
    fs.writeFile(argv.year+'accident.geojson', JSON.stringify(accidentJSON));
 
    // fs.writeFile(argv.year+'vehicle.geojson', JSON.stringify(vehicleJSON));
    
});
accidentParser.parse();
vehicleParser.parse();
personParser.parse();




