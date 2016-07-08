- Fetch the file using `ncftpget`. More details from http://www.nhtsa.gov/FARS
  `brew install ncftpget`
  `ncftpget -R -v ftp.nhtsa.dot.gov accident/ /fars/`
- Fields

C2/V2/D2/PC2/P2/NM2 Consecutive Number (ST_CASE) -> primary key



#### Accident related : MM-DD-YYYY/HH:MM/Crash Level/Fatalities

SAS Code|Description|Field name|Possible values
--------|-----------|----------|---------------
C8A |Month of Crash| MONTH| 01-12
C8B |Day of Crash| DAY| 01-31
C8C |Day of Week| DAY_WEEK| 1-7(Sun-Sat)
C8D |Year of Crash| YEAR| xx (1975-97), xxxx (1998-2013)
C9A |Hour of Crash| HOUR| 00-23, (88 - NA/not notified), 00-24(1975 - 2008)
C9B |Minute of Crash| MINUTE | 00-59, (88 - NA/ not notified), 
C31 |Crash Level| CF1, CF2, CF3 | 00-51(1975-81), 00-28(Later)
C101|Fatalities|FATALS -> for the entire crash | 
C18 |First Harmful Event| HARM_EV -> applies to crash| 01-99 (01- Rollover, 04- Gas inhalation, 11-live animal, 42- tree)
V32 |Most Harmful Event| M_HARM -> applies to vehicle| 01 - 73
C19 |Manner of Collision| MAN_COLL| 0-11
C22 |Relation to Trafficway| REL_ROAD| 01- 11 (On roadway, on shoulder, on median, on roadside)
C4A |Number of Motor Vehicles in Transport (MVIT)| VE_FORMS|
C5A |Number of Persons in Motor Vehicles in Transport (MVIT)| PERMVIT|
C20B|Relation to Junction- Specific Location| REL_JUNC, RELJCT2|1-20 (1-Non-junction, 2-Intersection, 20-Entrance/Exit ramp)
V4 |Number of Occupants| OCUPANTS, NUMOCCS, PNUMOCCS|
V28A |Initial Contact Point| IMPACT1|  0-83( 1-12 Clock points, 13 -top, 61-left, 81- right)
V29 |Extent of Damage| DEFORMED| 0-6( 2-Minor, 4-Functional, 6-Disabling)
D22 |Speeding Related| SPEEDREL 0-5(2-yes,racing, 3-exceede speed limit, 5-yes but specifics unknown, 8-not reported, 9-Unknown)
PC23 |Crash Type| ACC_TYPE|0-99 (1,6-Drive off road, 2,7- Control loss, 3,8- avoid collision with other vehicle/pedestrian/animal)
PC16 |Driver Distracted By| MDRDSTRD|00-99 (05- Cellphone,09- using vehicle controls)
PC14 |Driver’s Vision Obscured by| MVISOBSC





#### External Conditions

SAS Code|Description|Field name|Possible values
--------|-----------|----------|----------------
C10 |National Highway System| NHS| 0 -part of nhs, 1- not part of nhs ( 1998-later)
C11 |Roadway Function Class| ROAD_FNC| 01-06 -> rural, 11-16 -> urban (01,11 interstate, 06,16-local road/street)
C21 |Type of Intersection| TYP_INT| 1-10( 2  4way, 3 T, 4 Y, 5 Circle, 6 Roundabout, 7 5point, 10 L)
C25 |Atmospheric Conditions| WEATHER, WEATHER1, WEATHER2| 1-12 (1- clear, 2-rain, 3-sleet, 4-snow, 5-smoke/fog)
C24 |Light Condition| LGT_COND| 1-9(Daylight, Dark, Dark-not lighted, Dark but ligthed, Dark-lighted, Dawn, Dusk, Dawn or Dusk, Dark-unknown lighting, Other, not reported, Unknown)
PC5 |Trafficway Description| VTRAFWAY| 0-6 ( 1 undivided two way,2 divided two way,4 oneway,6 entrance/exit)
PC6 |Total Lanes in Roadway| VNUM_LAN
PC8 |Roadway Alignment| VALIGN| 0-4 (1- straight, 2 curve right, 3 curve left)
PC9 |Roadway Grade| VPROFILE| 0-6( 3- hillcrest, 5 uphill, 6 downhill)
PC10|Roadway Surface Type| VPAVETYP| 0-9 (1 Concrete, 4 Gravel, 5 Dirt)
PC11|Roadway Surface Condition| VSURCOND| 0-11 (Dry, Wet, Snow, Ice, Sand, water, oil, other, slush, mud)
PC12|Traffic Control Device| VTRAFCON| 1-9, 7-23, 40, 50, 65, 97
PC13| Traffic Control Device Functioning| VTCONT_F| 1- not funcitoning, 2 - Improper functioning, 3- Porper functioning

#### Vehicle related

SAS Code|Description|Field name
--------|-----------|----------
V9  |Vehicle Make| MAKE
V10 |Vehicle Model| MODEL
V24 |Travel Speed| TRAV_SP
V7 |Registration State| REG_STAT
V11 |Body Type| PBODYTYP, BODY_TYP
V13 |Vehicle Identification Number (VIN)| VIN -> separate fields available for each character
PC17|Pre-Event Movement (Prior To Recognition of Critical Event)| P_CRASH1
PC19|Critical Event- Precrash| P_CRASH2
PC20|Attempted Avoidance Maneuver| P_CRASH3
PC22|Pre-Impact Location| PCRASH5
V28B |Damaged Areas| MDAREAS

#### People Related

SAS Code|Description|Field name|Possible values
--------|-----------|----------|---------------
V151 |Driver Drinking| DR_DRINK
D24 |Related Factors- Driver Level| DR_CF1, DR_CF2, DR_CF3, DR_CF4, DR_SF1, DR_SF2, DR_SF3, DR_SF4| 00-99 (96 - onboard navigaiton system, 93-cellphone, 08-road rage, 05- alcohol/drugs/medication, 03-emotional)
P5/NM5 |Age| AGE
P6/NM6 |Sex| SEX
P7/NM7 |Person Type| PER_TYP
P9 |Seating Position| SEAT_POS
P10 |Restraint System/Helmet Use| REST_USE
NM11 |Non-Motorist Action/Circumstances Prior to Crash|  MPR_ACT




#### What can we look at?

- Which state has the maximum crashes happening?
- How many druken driving?
- In how many cases driver distraction was due to in-car navigation system?
- What time of the day has the maximum accidents?
- What day of the week has the maximum accidents?
- What month of the year has the maximum accidents?
- Trend in accident numbers over the years
- Gender and accidents
- Age group and accidents
- Which vehicle make was involved in the majority of accidents?
- What type of vehicle has been subjected to crashes?
- In how many ases non functioning traffic control device contirbuted to the crash?



Year|Number of Crashes|Invalid geometries| Total on map
----|-----------------|------------------|-------------
2014|29989|175|29814

