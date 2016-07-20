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
var highwayClass ={'01':'Principal Arterial – Interstate', '02':'Principal Arterial – Other', '03':'Minor Arterial',
                    '04':'Major Collector', '05':'Minor Collector', '06':'Local Road or Street','09':'Unknown',
                    '11':'Principal Arterial – Interstate','12':'Principal Arterial – Other Freeways or Expressways',
                    '13':'Other Principal Arterial','14':'Minor Arterial','15':'Collector','16':'Local Road or Street',
                    '19':'Unknown','99': 'Unknown'};
var firstEvent ={'01':'Rollover', '02':'Fire', '03':'Immersion', '04':'Gas inhalation', '05':'Fell from vehicle', 
                  '06':'Injured in vehicle','07':'Other non-collision','08':'Pedestrian','09':'Pedalcyclist',
                  '10':'Railway Vehicle','11':'Live Animal','12':'Motor vehicle in transport','14':'Parked motor vehicle',
                  '15':'Non motorist on personal conveyance','16': 'Thrown/Falling object', '17':'Boulder', '19':'Building',
                  '20':'Impact Attenuator/Crash Cushion', '21':'Bridge pier or support', '23':'Bridge rail', '24':'Guardrail face',
                  '25':'Concrete Traffic Barrier', '26':'Other Traffic Barrier','30':'Utility pole/light support','32':'Culvert',
                  '33':'Curb','34':'Ditch','35':'Embankment','38':'Fence','39':'Wall','40':'Fire hydrant','41':'Shrubbery','42':'Tree',
                  '44':'Pavement Surface irregularity','45':'Working motor vehicle','46':'Traffic signal support','48':'Snow bank',
                  '49':'Ridden Animal/Animal-Drawn Conveyance','50':'Bridge overhead structure','51':'Jackknife','52':'Guardrail End',
                  '53':'Mailbox','54':'Motor Vehicle In-Transport Strikes or is Struck by Cargo, Persons or Objects Set-in-Motion from/by Another Motor Vehicle In-Transport',
                  '55':'Motor Vehicle in Motion Outside the Trafficway','57':'Cable Barrier','58':'Ground','72':'Cargo/Equipment Loss or Shift',
                  '73':'Object Fell From Motor Vehicle In-Transport','98':'Not Reported','99':'Unknown'};

var mannerCollision={'1':'Front-to-Rear','2':'Front-to-Front','6':'Angle','7':'Sideswipe-Same direction',
                     '8':'Sideswipe-Opposite direction','9':'Rear-to-Side','10':'Rear-to-Rear','11':'Other',
                     '98':'Not Reported','99':'Unknown'};
var speedRel={'0':'No','1':'Yes','2':'Yes, Racing', '3':'Exceeded speed limit','4':'Yes, too fast for conditions',
              '5':'Yes specifics unknown','8':'No driver present/Unknown if driver present','9':'Unknown'};
var avoidanceManeuver ={'0':'No driver present/Unknown if driver present','1':'No avoidance maneuver','2':'Braking (No Lockup)',
                        '3':'Braking (Lockup)', '4':'Braking (Lockup Unknown', '5':'Releasing brakes','6':'Steering Left',
                        '7':'Steering Right','8':'Braking & Steering left','9':'Braking & Steering right','10':'Accelerating',
                        '11':'Accelerating & steering left','12':'Accelerating & steering right','98':'Other actions','99':'Unknown' };
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
  	  record['LATITUDE']== 99||record['LATITUDE']== 88 )
       {
  	// console.log('no geometry');

  } else {
    if(record['TYP_INT']!=1)
    {
  	// console.log('valid geometry');
    accidentFeatureJSON.geometry.coordinates[0] = record['LONGITUD'];
    accidentFeatureJSON.geometry.coordinates[1] = record['LATITUDE'];
    accidentFeatureJSON.properties['state'] = record['STATE'];
    accidentFeatureJSON.properties['crashNum'] = record['ST_CASE'];
    accidentFeatureJSON.properties['day'] = record['DAY'];
    accidentFeatureJSON.properties['month'] = record['MONTH'];
    accidentFeatureJSON.properties['year']=record['YEAR'];
    accidentFeatureJSON.properties['weekday'] = day[record['DAY_WEEK']];
    accidentFeatureJSON.properties['hour'] = record['HOUR'];
    accidentFeatureJSON.properties['minute']=record['MINUTE'];
    accidentFeatureJSON.properties['time'] = record['HOUR']+':'+record['MINUTE'];
    accidentFeatureJSON.properties['fatalities'] = record['FATALS'];
    // accidentFeatureJSON.properties['vehicles involved'] = record['PVE_FORMS'];
    // accidentFeatureJSON.properties['make'] =[];
    accidentFeatureJSON.properties['pedestrian'] = record['PEDS'];
    accidentFeatureJSON.properties['people not in vehicle'] =record['PERNOTMVIT'];
    accidentFeatureJSON.properties['people in vehicle']  = record['PERMVIT'];
    accidentFeatureJSON.properties['highway function'] = highwayClass[record['ROAD_FNC']];
    accidentFeatureJSON.properties['intersection'] = intersection[record['TYP_INT']];
    accidentFeatureJSON.properties['highway name'] = record['TWAY_ID']+","+record['TWAY_ID2'];
    accidentFeatureJSON.properties['light condition'] = light[record['LGT_COND']];
    accidentFeatureJSON.properties['weather'] = weather[record['WEATHER']]+ ","+
                                                weather[record['WEATHER1']]+","+
                                                weather[record['WEATHER2']];
    accidentFeatureJSON.properties['drunk driver'] = record['DRUNK_DR'];
    accidentJSON.features.push(accidentFeatureJSON); 
  }
  }

});
vehicleParser.on('record', function(record) {
  

  accidentJSON.features.forEach(function(item){
    if(record['ST_CASE'] == item.properties.crashNum){
      // if(item.properties['make'])
      // {

      // }

     // item.properties.make.push(vehicleMake[record['MAKE']]);
     // console.log(vehicleMake[record['MAKE']]);
     item.properties[vehicleMake[record['MAKE']]] ='yes';
     item.properties['vehicles involved'] =record['VE_FORMS'];
     item.properties['first event'] = firstEvent[record['HARM_EV']];
     item.properties['speed related'] = speedRel[record['SPEEDREL']];
     item.properties['manner of collision'] = mannerCollision[record['MAN_COLL']];
     item.properties['avoidance maneuver'] = avoidanceManeuver[record['P_CRASH3']];
     
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
   
    fs.writeFile(argv.year+'intersectionOnly.geojson', JSON.stringify(accidentJSON, null, 4));
 
    // fs.writeFile(argv.year+'vehicle.geojson', JSON.stringify(vehicleJSON));
    
});
accidentParser.parse();
vehicleParser.parse();
personParser.parse();




