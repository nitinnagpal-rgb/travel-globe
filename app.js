import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===========================
// DATA
// ===========================

const AIRPORTS = {
  "AAR":{lat:56.3,lng:10.619,city:"Aarhus",country:"Denmark"},
  "AKL":{lat:-36.849,lng:174.763,city:"Auckland",country:"New Zealand"},
  "AMS":{lat:52.311,lng:4.768,city:"Amsterdam",country:"Netherlands"},
  "ARN":{lat:59.652,lng:17.919,city:"Stockholm",country:"Sweden"},
  "ATL":{lat:33.637,lng:-84.428,city:"Atlanta",country:"USA"},
  "AUS":{lat:30.195,lng:-97.670,city:"Austin",country:"USA"},
  "BCN":{lat:41.297,lng:2.083,city:"Barcelona",country:"Spain"},
  "BLR":{lat:13.199,lng:77.707,city:"Bangalore",country:"India"},
  "BNA":{lat:36.125,lng:-86.678,city:"Nashville",country:"USA"},
  "BNE":{lat:-27.384,lng:153.118,city:"Brisbane",country:"Australia"},
  "BOM":{lat:19.089,lng:72.868,city:"Mumbai",country:"India"},
  "BRU":{lat:50.901,lng:4.484,city:"Brussels",country:"Belgium"},
  "CBR":{lat:-35.307,lng:149.195,city:"Canberra",country:"Australia"},
  "CDG":{lat:49.010,lng:2.548,city:"Paris",country:"France"},
  "CGN":{lat:50.866,lng:7.143,city:"Cologne",country:"Germany"},
  "CHC":{lat:-43.489,lng:172.532,city:"Christchurch",country:"New Zealand"},
  "CLT":{lat:35.214,lng:-80.943,city:"Charlotte",country:"USA"},
  "CPH":{lat:55.618,lng:12.651,city:"Copenhagen",country:"Denmark"},
  "CUN":{lat:21.037,lng:-86.877,city:"Cancún",country:"Mexico"},
  "CUZ":{lat:-13.536,lng:-71.939,city:"Cusco",country:"Peru"},
  "CVG":{lat:39.049,lng:-84.668,city:"Cincinnati",country:"USA"},
  "DAL":{lat:32.847,lng:-96.852,city:"Dallas Love",country:"USA"},
  "DEL":{lat:28.556,lng:77.100,city:"New Delhi",country:"India"},
  "DEN":{lat:39.856,lng:-104.674,city:"Denver",country:"USA"},
  "DFW":{lat:32.900,lng:-97.040,city:"Dallas/FW",country:"USA"},
  "DTW":{lat:42.212,lng:-83.353,city:"Detroit",country:"USA"},
  "EDI":{lat:55.950,lng:-3.373,city:"Edinburgh",country:"UK"},
  "EWR":{lat:40.693,lng:-74.169,city:"Newark",country:"USA"},
  "EZE":{lat:-34.822,lng:-58.536,city:"Buenos Aires",country:"Argentina"},
  "FRA":{lat:50.038,lng:8.562,city:"Frankfurt",country:"Germany"},
  "GLA":{lat:55.872,lng:-4.433,city:"Glasgow",country:"UK"},
  "HEL":{lat:60.317,lng:24.963,city:"Helsinki",country:"Finland"},
  "HKT":{lat:8.113,lng:98.317,city:"Phuket",country:"Thailand"},
  "IAD":{lat:38.953,lng:-77.457,city:"Washington DC",country:"USA"},
  "IAH":{lat:29.984,lng:-95.341,city:"Houston",country:"USA"},
  "KSC":{lat:48.663,lng:21.241,city:"Košice",country:"Slovakia"},
  "LAS":{lat:36.084,lng:-115.154,city:"Las Vegas",country:"USA"},
  "LAX":{lat:33.943,lng:-118.408,city:"Los Angeles",country:"USA"},
  "LCY":{lat:51.505,lng:0.055,city:"London City",country:"UK"},
  "LHR":{lat:51.470,lng:-0.454,city:"London",country:"UK"},
  "LIH":{lat:21.976,lng:-159.339,city:"Kauai",country:"USA"},
  "LIM":{lat:-12.022,lng:-77.114,city:"Lima",country:"Peru"},
  "MAA":{lat:12.994,lng:80.171,city:"Chennai",country:"India"},
  "MAD":{lat:40.498,lng:-3.568,city:"Madrid",country:"Spain"},
  "MCO":{lat:28.431,lng:-81.308,city:"Orlando",country:"USA"},
  "MEL":{lat:-37.673,lng:144.843,city:"Melbourne",country:"Australia"},
  "MIA":{lat:25.796,lng:-80.287,city:"Miami",country:"USA"},
  "MUC":{lat:48.354,lng:11.786,city:"Munich",country:"Germany"},
  "OGG":{lat:20.899,lng:-156.431,city:"Maui",country:"USA"},
  "OMA":{lat:41.303,lng:-95.894,city:"Omaha",country:"USA"},
  "ORD":{lat:41.974,lng:-87.907,city:"Chicago",country:"USA"},
  "ORY":{lat:48.723,lng:2.379,city:"Paris Orly",country:"France"},
  "OSL":{lat:60.194,lng:11.100,city:"Oslo",country:"Norway"},
  "PNQ":{lat:18.582,lng:73.920,city:"Pune",country:"India"},
  "PTY":{lat:9.071,lng:-79.384,city:"Panama City",country:"Panama"},
  "RDU":{lat:35.878,lng:-78.788,city:"Raleigh",country:"USA"},
  "SAN":{lat:32.734,lng:-117.193,city:"San Diego",country:"USA"},
  "SAT":{lat:29.534,lng:-98.470,city:"San Antonio",country:"USA"},
  "SEA":{lat:47.450,lng:-122.309,city:"Seattle",country:"USA"},
  "SFO":{lat:37.621,lng:-122.379,city:"San Francisco",country:"USA"},
  "SJC":{lat:37.363,lng:-121.929,city:"San Jose",country:"USA"},
  "SJD":{lat:23.152,lng:-109.721,city:"Cabo San Lucas",country:"Mexico"},
  "SLC":{lat:40.788,lng:-111.978,city:"Salt Lake City",country:"USA"},
  "SNA":{lat:33.676,lng:-117.868,city:"Orange County",country:"USA"},
  "STL":{lat:38.749,lng:-90.370,city:"St. Louis",country:"USA"},
  "SYD":{lat:-33.946,lng:151.177,city:"Sydney",country:"Australia"},
  "USH":{lat:-54.843,lng:-68.296,city:"Ushuaia",country:"Argentina"},
  "VIE":{lat:48.110,lng:16.570,city:"Vienna",country:"Austria"},
  "YVR":{lat:49.197,lng:-123.182,city:"Vancouver",country:"Canada"},
  "YYC":{lat:51.122,lng:-114.008,city:"Calgary",country:"Canada"},
  "YYZ":{lat:43.678,lng:-79.625,city:"Toronto",country:"Canada"},
  "ZQN":{lat:-45.021,lng:168.739,city:"Queenstown",country:"New Zealand"},
  "ZRH":{lat:47.465,lng:8.549,city:"Zurich",country:"Switzerland"}
};

// Region classification
function getRegion(code) {
  const ap = AIRPORTS[code];
  if (!ap) return 'other';
  const { lat, lng, country } = ap;
  if (country === 'Argentina' && code === 'USH') return 'antarctica'; // Ushuaia → gateway
  if (['Argentina', 'Peru', 'Panama'].includes(country)) return 'south-america';
  if (['India', 'Thailand', 'Singapore'].includes(country)) return 'asia';
  if (['Australia', 'New Zealand'].includes(country)) return 'oceania';
  if (['UK', 'Germany', 'France', 'Netherlands', 'Sweden', 'Denmark', 'Norway',
       'Finland', 'Belgium', 'Spain', 'Austria', 'Slovakia', 'Switzerland', 'Italy'].includes(country))
    return 'europe';
  if (['USA', 'Canada', 'Mexico'].includes(country)) return 'north-america';
  return 'other';
}

const REGIONS = {
  'north-america': { label: 'North America', color: '#448aff' },
  'europe':        { label: 'Europe', color: '#ffd740' },
  'asia':          { label: 'Asia', color: '#ff4081' },
  'oceania':       { label: 'Oceania', color: '#69f0ae' },
  'south-america': { label: 'South America', color: '#ff6e40' },
  'antarctica':    { label: 'Antarctica', color: '#00e5ff' },
};

// Flight data — all 353 flights parsed
const FLIGHTS = [
  {date:"2024-06-14",from:"EWR",to:"SFO",airline:"United Airlines",dist:2559},
  {date:"2024-06-12",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2024-05-22",from:"EWR",to:"SFO",airline:"United Airlines",dist:2559},
  {date:"2024-05-20",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2024-05-13",from:"YYZ",to:"SFO",airline:"United Airlines",dist:2253},
  {date:"2024-05-12",from:"DEL",to:"YYZ",airline:"United Airlines",dist:7228},
  {date:"2024-05-11",from:"PNQ",to:"DEL",airline:"Air Vistara",dist:718},
  {date:"2024-05-08",from:"DEL",to:"PNQ",airline:"United Airlines",dist:718},
  {date:"2024-05-05",from:"SFO",to:"YYZ",airline:"United Airlines",dist:2252},
  {date:"2024-05-05",from:"YYZ",to:"DEL",airline:"United Airlines",dist:7232},
  {date:"2024-04-24",from:"BNA",to:"SFO",airline:"United Airlines",dist:1963},
  {date:"2024-04-21",from:"SFO",to:"BNA",airline:"United Airlines",dist:1962},
  {date:"2024-03-21",from:"SFO",to:"LAX",airline:"United Airlines",dist:337},
  {date:"2024-03-21",from:"LAX",to:"SFO",airline:"United Airlines",dist:337},
  {date:"2024-03-06",from:"SFO",to:"SEA",airline:"Delta Air Lines",dist:679},
  {date:"2024-03-06",from:"SEA",to:"SFO",airline:"Delta Air Lines",dist:679},
  {date:"2024-03-03",from:"DEL",to:"SFO",airline:"Air India Limited",dist:7693},
  {date:"2024-02-25",from:"DEL",to:"PNQ",airline:"Air Vistara",dist:718},
  {date:"2024-02-25",from:"PNQ",to:"DEL",airline:"Air Vistara",dist:718},
  {date:"2024-02-24",from:"SFO",to:"DEL",airline:"Air India Limited",dist:7693},
  {date:"2023-11-29",from:"LAS",to:"SJC",airline:"Southwest Airlines",dist:385},
  {date:"2023-11-28",from:"SJC",to:"LAS",airline:"Southwest Airlines",dist:385},
  {date:"2023-08-11",from:"PNQ",to:"DEL",airline:"Air Vistara",dist:718},
  {date:"2023-08-07",from:"DEL",to:"PNQ",airline:"Air Vistara",dist:718},
  {date:"2023-08-06",from:"FRA",to:"DEL",airline:"Lufthansa",dist:3801},
  {date:"2023-08-05",from:"SFO",to:"FRA",airline:"United Airlines",dist:5684},
  {date:"2023-06-19",from:"BRU",to:"ORD",airline:"United Airlines",dist:4147},
  {date:"2023-06-19",from:"ORD",to:"SFO",airline:"United Airlines",dist:1841},
  {date:"2023-06-09",from:"CPH",to:"AAR",airline:"SAS",dist:91},
  {date:"2023-06-08",from:"EDI",to:"CPH",airline:"Norwegian",dist:621},
  {date:"2023-06-07",from:"LHR",to:"EDI",airline:"British Airways",dist:331},
  {date:"2023-06-03",from:"SFO",to:"LHR",airline:"United Airlines",dist:5353},
  {date:"2023-02-28",from:"IAH",to:"SFO",airline:"United Airlines",dist:1632},
  {date:"2023-02-27",from:"USH",to:"EZE",airline:"Aerolineas Argentinas",dist:1460},
  {date:"2023-02-27",from:"EZE",to:"IAH",airline:"United Airlines",dist:5078},
  {date:"2023-02-15",from:"EZE",to:"USH",airline:"Aerolineas Argentinas",dist:1460},
  {date:"2023-02-13",from:"SFO",to:"IAH",airline:"United Airlines",dist:1632},
  {date:"2023-02-13",from:"IAH",to:"EZE",airline:"United Airlines",dist:5078},
  {date:"2022-11-29",from:"SJC",to:"LAS",airline:"Southwest Airlines",dist:385},
  {date:"2022-11-29",from:"LAS",to:"SJC",airline:"Southwest Airlines",dist:385},
  {date:"2022-10-21",from:"LHR",to:"SFO",airline:"United Airlines",dist:5353},
  {date:"2022-10-18",from:"EWR",to:"LHR",airline:"United Airlines",dist:3455},
  {date:"2022-10-17",from:"SFO",to:"EWR",airline:"United Airlines",dist:2559},
  {date:"2022-10-10",from:"DEL",to:"SFO",airline:"Air India Limited",dist:7693},
  {date:"2022-10-07",from:"PNQ",to:"DEL",airline:"Air Vistara",dist:718},
  {date:"2022-10-02",from:"DEL",to:"PNQ",airline:"Air Vistara",dist:718},
  {date:"2022-09-29",from:"SFO",to:"DEL",airline:"Air India Limited",dist:7693},
  {date:"2022-08-30",from:"LIM",to:"PTY",airline:"Copa Airlines",dist:1465},
  {date:"2022-08-30",from:"PTY",to:"IAH",airline:"United Airlines",dist:1774},
  {date:"2022-08-30",from:"IAH",to:"SFO",airline:"United Airlines",dist:1632},
  {date:"2022-08-29",from:"CUZ",to:"LIM",airline:"LAN Airlines",dist:364},
  {date:"2022-08-25",from:"IAH",to:"LIM",airline:"United Airlines",dist:3145},
  {date:"2022-08-25",from:"LIM",to:"CUZ",airline:"LAN Airlines",dist:364},
  {date:"2022-08-24",from:"SFO",to:"IAH",airline:"United Airlines",dist:1632},
  {date:"2022-08-11",from:"LHR",to:"SFO",airline:"United Airlines",dist:5353},
  {date:"2022-08-03",from:"SFO",to:"LHR",airline:"United Airlines",dist:5353},
  {date:"2022-06-16",from:"BNA",to:"SFO",airline:"United Airlines",dist:1963},
  {date:"2022-06-14",from:"SFO",to:"BNA",airline:"United Airlines",dist:1962},
  {date:"2022-06-10",from:"ARN",to:"AMS",airline:"SAS",dist:715},
  {date:"2022-06-10",from:"AMS",to:"SFO",airline:"United Airlines",dist:5459},
  {date:"2022-06-09",from:"OSL",to:"ARN",airline:"Ethiopian Airlines",dist:240},
  {date:"2022-06-08",from:"ARN",to:"OSL",airline:"SAS",dist:240},
  {date:"2022-06-07",from:"HEL",to:"ARN",airline:"Finnair",dist:247},
  {date:"2022-06-05",from:"MUC",to:"HEL",airline:"Lufthansa",dist:978},
  {date:"2022-06-04",from:"SFO",to:"MUC",airline:"United Airlines",dist:5863},
  {date:"2022-05-20",from:"DEL",to:"FRA",airline:"Lufthansa",dist:3803},
  {date:"2022-05-20",from:"FRA",to:"SFO",airline:"Lufthansa",dist:5684},
  {date:"2022-05-11",from:"SFO",to:"EWR",airline:"United Airlines",dist:2559},
  {date:"2022-05-11",from:"EWR",to:"DEL",airline:"United Airlines",dist:7309},
  {date:"2022-05-06",from:"SFO",to:"SNA",airline:"United Airlines",dist:371},
  {date:"2022-04-27",from:"DFW",to:"DEN",airline:"United Airlines",dist:641},
  {date:"2022-04-27",from:"DEN",to:"SFO",airline:"United Airlines",dist:964},
  {date:"2022-04-26",from:"SFO",to:"DFW",airline:"United Airlines",dist:1461},
  {date:"2022-04-21",from:"RDU",to:"SFO",airline:"United Airlines",dist:2394},
  {date:"2022-04-19",from:"SFO",to:"RDU",airline:"United Airlines",dist:2394},
  {date:"2022-04-07",from:"AUS",to:"IAH",airline:"United Airlines",dist:139},
  {date:"2022-04-07",from:"IAH",to:"SFO",airline:"United Airlines",dist:1632},
  {date:"2022-04-04",from:"SFO",to:"IAH",airline:"United Airlines",dist:1632},
  {date:"2022-04-04",from:"IAH",to:"AUS",airline:"United Airlines",dist:139},
  {date:"2022-03-25",from:"LHR",to:"SFO",airline:"United Airlines",dist:5353},
  {date:"2022-03-24",from:"ARN",to:"LHR",airline:"SAS",dist:908},
  {date:"2022-03-21",from:"LHR",to:"ARN",airline:"SAS",dist:908},
  {date:"2022-03-20",from:"SFO",to:"LHR",airline:"United Airlines",dist:5353},
  {date:"2022-03-18",from:"LHR",to:"SFO",airline:"United Airlines",dist:5353},
  {date:"2022-03-17",from:"GLA",to:"LCY",airline:"British Airways",dist:353},
  {date:"2022-03-16",from:"LCY",to:"GLA",airline:"British Airways",dist:353},
  {date:"2022-03-13",from:"SFO",to:"LHR",airline:"United Airlines",dist:5353},
  {date:"2022-02-08",from:"SNA",to:"SFO",airline:"United Airlines",dist:371},
  {date:"2022-02-07",from:"SFO",to:"SNA",airline:"United Airlines",dist:371},
  {date:"2021-12-18",from:"DEL",to:"SFO",airline:"United Airlines",dist:7693},
  {date:"2021-12-16",from:"BOM",to:"DEL",airline:"Air Vistara",dist:707},
  {date:"2021-12-15",from:"BLR",to:"BOM",airline:"Air Vistara",dist:518},
  {date:"2021-12-12",from:"DEL",to:"BLR",airline:"Air Vistara",dist:1062},
  {date:"2021-12-07",from:"SFO",to:"DEL",airline:"United Airlines",dist:7693},
  {date:"2021-12-03",from:"RDU",to:"SFO",airline:"United Airlines",dist:2394},
  {date:"2021-12-02",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2021-12-02",from:"DEN",to:"RDU",airline:"United Airlines",dist:1433},
  {date:"2021-11-13",from:"LHR",to:"SFO",airline:"United Airlines",dist:5353},
  {date:"2021-11-11",from:"MUC",to:"LHR",airline:"Lufthansa",dist:585},
  {date:"2021-11-09",from:"CDG",to:"MUC",airline:"Lufthansa",dist:423},
  {date:"2021-11-07",from:"LHR",to:"CDG",airline:"British Airways",dist:215},
  {date:"2021-11-07",from:"SFO",to:"LHR",airline:"United Airlines",dist:5353},
  {date:"2021-10-29",from:"AUS",to:"SFO",airline:"United Airlines",dist:1501},
  {date:"2021-10-29",from:"DFW",to:"AUS",airline:"American Airlines",dist:190},
  {date:"2021-10-27",from:"SFO",to:"DFW",airline:"United Airlines",dist:1461},
  {date:"2021-10-23",from:"OGG",to:"SFO",airline:"United Airlines",dist:2336},
  {date:"2021-10-14",from:"SFO",to:"OGG",airline:"United Airlines",dist:2336},
  {date:"2021-10-11",from:"SNA",to:"SFO",airline:"United Airlines",dist:371},
  {date:"2021-10-11",from:"SFO",to:"SNA",airline:"United Airlines",dist:371},
  {date:"2021-06-08",from:"IAH",to:"DTW",airline:"United Airlines",dist:1074},
  {date:"2021-06-08",from:"SJC",to:"IAH",airline:"United Airlines",dist:1605},
  {date:"2021-05-20",from:"ORD",to:"SFO",airline:"United Airlines",dist:1841},
  {date:"2021-05-20",from:"CVG",to:"ORD",airline:"United Airlines",dist:264},
  {date:"2021-05-19",from:"IAH",to:"CVG",airline:"United Airlines",dist:870},
  {date:"2021-05-19",from:"SJC",to:"IAH",airline:"United Airlines",dist:1605},
  {date:"2020-03-05",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2020-03-04",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2020-02-21",from:"LAS",to:"SFO",airline:"United Airlines",dist:412},
  {date:"2020-02-18",from:"SFO",to:"LAS",airline:"United Airlines",dist:412},
  {date:"2020-02-11",from:"DEL",to:"SFO",airline:"United Airlines",dist:7688},
  {date:"2020-02-05",from:"MAA",to:"DEL",airline:"Air UK",dist:1093},
  {date:"2020-02-04",from:"BLR",to:"MAA",airline:"Spicejet",dist:166},
  {date:"2020-02-03",from:"DEL",to:"BLR",airline:"Spicejet",dist:1061},
  {date:"2020-01-31",from:"SFO",to:"DEL",airline:"United Airlines",dist:7688},
  {date:"2020-01-23",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2020-01-21",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-12-26",from:"LIH",to:"SFO",airline:"United Airlines",dist:2443},
  {date:"2019-12-20",from:"SFO",to:"LIH",airline:"United Airlines",dist:2443},
  {date:"2019-12-18",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-12-17",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-12-12",from:"CDG",to:"SFO",airline:"United Airlines",dist:5565},
  {date:"2019-12-10",from:"SFO",to:"CDG",airline:"United Airlines",dist:5565},
  {date:"2019-11-22",from:"EWR",to:"SFO",airline:"United Airlines",dist:2557},
  {date:"2019-11-21",from:"YYZ",to:"EWR",airline:"United Airlines",dist:347},
  {date:"2019-11-19",from:"YYC",to:"YYZ",airline:"WestJet",dist:1670},
  {date:"2019-11-18",from:"SFO",to:"YYC",airline:"United Airlines",dist:1017},
  {date:"2019-11-17",from:"SJD",to:"SFO",airline:"United Airlines",dist:1248},
  {date:"2019-11-15",from:"SFO",to:"SJD",airline:"United Airlines",dist:1248},
  {date:"2019-11-12",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2019-11-07",from:"BCN",to:"FRA",airline:"Lufthansa",dist:679},
  {date:"2019-11-07",from:"FRA",to:"LHR",airline:"Lufthansa",dist:406},
  {date:"2019-11-04",from:"MUC",to:"BCN",airline:"Lufthansa",dist:679},
  {date:"2019-11-03",from:"SFO",to:"MUC",airline:"Lufthansa",dist:5860},
  {date:"2019-10-29",from:"DFW",to:"SFO",airline:"US Airways",dist:1460},
  {date:"2019-10-28",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-10-24",from:"EWR",to:"SFO",airline:"United Airlines",dist:2557},
  {date:"2019-10-20",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2019-10-18",from:"YYZ",to:"SFO",airline:"United Airlines",dist:2252},
  {date:"2019-10-17",from:"SFO",to:"YYZ",airline:"United Airlines",dist:2252},
  {date:"2019-10-10",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-10-09",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-10-04",from:"MUC",to:"SFO",airline:"United Airlines",dist:5860},
  {date:"2019-09-29",from:"SFO",to:"MUC",airline:"United Airlines",dist:5860},
  {date:"2019-09-25",from:"DEN",to:"DFW",airline:"United Airlines",dist:640},
  {date:"2019-09-25",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-09-23",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2019-09-17",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2019-09-15",from:"SFO",to:"LHR",airline:"United Airlines",dist:5350},
  {date:"2019-09-13",from:"SYD",to:"SFO",airline:"United Airlines",dist:7421},
  {date:"2019-09-12",from:"SYD",to:"MEL",airline:"Qantas",dist:438},
  {date:"2019-09-12",from:"MEL",to:"SYD",airline:"Qantas",dist:438},
  {date:"2019-09-07",from:"SFO",to:"SYD",airline:"United Airlines",dist:7421},
  {date:"2019-08-29",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-08-28",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-08-11",from:"DEL",to:"YVR",airline:"United Airlines",dist:6916},
  {date:"2019-08-11",from:"YVR",to:"SFO",airline:"United Airlines",dist:800},
  {date:"2019-08-10",from:"HKT",to:"DEL",airline:"GoAir",dist:1974},
  {date:"2019-08-07",from:"DEL",to:"HKT",airline:"GoAir",dist:1974},
  {date:"2019-08-03",from:"YVR",to:"DEL",airline:"United Airlines",dist:6916},
  {date:"2019-08-02",from:"SFO",to:"YVR",airline:"United Airlines",dist:800},
  {date:"2019-07-24",from:"YVR",to:"SFO",airline:"United Airlines",dist:800},
  {date:"2019-07-23",from:"DFW",to:"YVR",airline:"American Airlines",dist:1750},
  {date:"2019-07-22",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-07-20",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-07-17",from:"CGN",to:"LHR",airline:"United Airlines",dist:331},
  {date:"2019-07-17",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2019-07-15",from:"ZRH",to:"CGN",airline:"United Airlines",dist:243},
  {date:"2019-07-14",from:"SFO",to:"ZRH",airline:"United Airlines",dist:5822},
  {date:"2019-07-13",from:"SAN",to:"SFO",airline:"United Airlines",dist:446},
  {date:"2019-07-08",from:"FRA",to:"SFO",airline:"United Airlines",dist:5681},
  {date:"2019-07-08",from:"SFO",to:"SAN",airline:"United Airlines",dist:446},
  {date:"2019-07-07",from:"SFO",to:"FRA",airline:"Lufthansa",dist:5681},
  {date:"2019-06-27",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-06-26",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-06-24",from:"ORD",to:"SFO",airline:"United Airlines",dist:1840},
  {date:"2019-06-23",from:"SFO",to:"ORD",airline:"United Airlines",dist:1840},
  {date:"2019-06-13",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-06-11",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-06-06",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-06-05",from:"LHR",to:"IAD",airline:"United Airlines",dist:3665},
  {date:"2019-06-05",from:"IAD",to:"DFW",airline:"United Airlines",dist:1169},
  {date:"2019-06-04",from:"MAD",to:"LHR",airline:"British Airways",dist:773},
  {date:"2019-05-31",from:"AMS",to:"MAD",airline:"KLM",dist:907},
  {date:"2019-05-24",from:"SFO",to:"AMS",airline:"United Airlines",dist:5455},
  {date:"2019-05-20",from:"STL",to:"SFO",airline:"United Airlines",dist:1730},
  {date:"2019-05-19",from:"SFO",to:"STL",airline:"United Airlines",dist:1730},
  {date:"2019-05-17",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-05-16",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-05-15",from:"YVR",to:"SFO",airline:"United Airlines",dist:800},
  {date:"2019-05-14",from:"SFO",to:"YVR",airline:"United Airlines",dist:800},
  {date:"2019-05-08",from:"CUN",to:"LAX",airline:"United Airlines",dist:2115},
  {date:"2019-05-08",from:"LAX",to:"SFO",airline:"United Airlines",dist:337},
  {date:"2019-05-04",from:"SFO",to:"CUN",airline:"United Airlines",dist:2404},
  {date:"2019-04-26",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-04-24",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2019-04-17",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2019-04-16",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-04-04",from:"RDU",to:"SFO",airline:"United Airlines",dist:2392},
  {date:"2019-04-03",from:"EWR",to:"RDU",airline:"United Airlines",dist:416},
  {date:"2019-04-02",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2019-03-29",from:"SYD",to:"SFO",airline:"United Airlines",dist:7421},
  {date:"2019-03-27",from:"CBR",to:"BNE",airline:"Qantas",dist:593},
  {date:"2019-03-27",from:"BNE",to:"SYD",airline:"Qantas",dist:467},
  {date:"2019-03-26",from:"SYD",to:"CBR",airline:"Qantas",dist:146},
  {date:"2019-03-23",from:"SFO",to:"SYD",airline:"United Airlines",dist:7421},
  {date:"2019-03-20",from:"SAN",to:"SFO",airline:"United Airlines",dist:446},
  {date:"2019-03-16",from:"SFO",to:"SAN",airline:"United Airlines",dist:446},
  {date:"2019-03-13",from:"MIA",to:"SFO",airline:"United Airlines",dist:2579},
  {date:"2019-03-11",from:"SFO",to:"MIA",airline:"United Airlines",dist:2579},
  {date:"2019-03-07",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-03-06",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2019-03-02",from:"CDG",to:"SFO",airline:"United Airlines",dist:5565},
  {date:"2019-02-28",from:"FRA",to:"CDG",airline:"Lufthansa",dist:278},
  {date:"2019-02-26",from:"SFO",to:"FRA",airline:"United Airlines",dist:5681},
  {date:"2019-02-20",from:"STL",to:"ORD",airline:"United Airlines",dist:257},
  {date:"2019-02-20",from:"ORD",to:"SFO",airline:"United Airlines",dist:1840},
  {date:"2019-02-19",from:"SFO",to:"STL",airline:"United Airlines",dist:1730},
  {date:"2019-02-07",from:"SEA",to:"SFO",airline:"United Airlines",dist:678},
  {date:"2019-02-04",from:"SFO",to:"SEA",airline:"United Airlines",dist:678},
  {date:"2019-02-01",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-01-31",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2019-01-24",from:"MUC",to:"LHR",airline:"Lufthansa",dist:584},
  {date:"2019-01-24",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2019-01-22",from:"FRA",to:"MUC",airline:"Lufthansa",dist:185},
  {date:"2019-01-21",from:"MUC",to:"FRA",airline:"Lufthansa",dist:185},
  {date:"2019-01-20",from:"SFO",to:"MUC",airline:"Lufthansa",dist:5860},
  {date:"2019-01-14",from:"STL",to:"SFO",airline:"United Airlines",dist:1730},
  {date:"2019-01-13",from:"SFO",to:"STL",airline:"United Airlines",dist:1730},
  {date:"2019-01-13",from:"STL",to:"DEN",airline:"United Airlines",dist:767},
  {date:"2019-01-08",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2019-01-07",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2018-12-15",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2018-12-14",from:"MAD",to:"LHR",airline:"British Airways",dist:773},
  {date:"2018-12-13",from:"AMS",to:"MAD",airline:"Iberia Airlines",dist:907},
  {date:"2018-12-11",from:"LHR",to:"AMS",airline:"British Airways",dist:230},
  {date:"2018-12-09",from:"SFO",to:"LHR",airline:"United Airlines",dist:5350},
  {date:"2018-11-28",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2018-11-27",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2018-11-21",from:"SJD",to:"SFO",airline:"United Airlines",dist:1248},
  {date:"2018-11-17",from:"SFO",to:"SJD",airline:"United Airlines",dist:1248},
  {date:"2018-11-16",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-11-15",from:"MCO",to:"DFW",airline:"American Airlines",dist:982},
  {date:"2018-11-13",from:"SFO",to:"MCO",airline:"United Airlines",dist:2440},
  {date:"2018-10-31",from:"OMA",to:"LAS",airline:"Southwest Airlines",dist:1096},
  {date:"2018-10-31",from:"LAS",to:"SFO",airline:"Southwest Airlines",dist:412},
  {date:"2018-10-30",from:"SFO",to:"OMA",airline:"United Airlines",dist:1428},
  {date:"2018-10-26",from:"EWR",to:"SFO",airline:"United Airlines",dist:2557},
  {date:"2018-10-23",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2018-10-18",from:"MCO",to:"SFO",airline:"United Airlines",dist:2440},
  {date:"2018-10-16",from:"SFO",to:"MCO",airline:"United Airlines",dist:2440},
  {date:"2018-10-11",from:"IAD",to:"DEN",airline:"United Airlines",dist:1448},
  {date:"2018-10-11",from:"DEN",to:"SJC",airline:"United Airlines",dist:945},
  {date:"2018-10-10",from:"SJC",to:"DEN",airline:"United Airlines",dist:945},
  {date:"2018-10-10",from:"DEN",to:"IAD",airline:"United Airlines",dist:1448},
  {date:"2018-10-06",from:"DEL",to:"YVR",airline:"Air Canada",dist:6916},
  {date:"2018-10-06",from:"YVR",to:"SFO",airline:"United Airlines",dist:800},
  {date:"2018-10-04",from:"BLR",to:"DEL",airline:"Jet Airways",dist:1061},
  {date:"2018-10-02",from:"DEL",to:"BLR",airline:"Jet Airways",dist:1061},
  {date:"2018-09-29",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2018-09-29",from:"EWR",to:"DEL",airline:"United Airlines",dist:7305},
  {date:"2018-09-14",from:"CDG",to:"SFO",airline:"United Airlines",dist:5565},
  {date:"2018-09-12",from:"ARN",to:"ORY",airline:"Norwegian",dist:976},
  {date:"2018-09-11",from:"LHR",to:"ARN",airline:"SAS",dist:908},
  {date:"2018-09-09",from:"SFO",to:"LHR",airline:"United Airlines",dist:5350},
  {date:"2018-08-29",from:"LAS",to:"SFO",airline:"United Airlines",dist:412},
  {date:"2018-08-27",from:"SFO",to:"LAS",airline:"United Airlines",dist:412},
  {date:"2018-08-24",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-08-22",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2018-08-17",from:"ATL",to:"SFO",airline:"United Airlines",dist:2133},
  {date:"2018-08-16",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2018-08-16",from:"DEN",to:"ATL",airline:"United Airlines",dist:1196},
  {date:"2018-08-03",from:"RDU",to:"SFO",airline:"United Airlines",dist:2392},
  {date:"2018-08-02",from:"DFW",to:"RDU",airline:"American Airlines",dist:1058},
  {date:"2018-08-01",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2018-07-26",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-07-25",from:"CLT",to:"DFW",airline:"American Airlines",dist:933},
  {date:"2018-07-24",from:"SFO",to:"ORD",airline:"United Airlines",dist:1840},
  {date:"2018-07-24",from:"ORD",to:"CLT",airline:"United Airlines",dist:599},
  {date:"2018-07-19",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2018-07-13",from:"DFW",to:"SAT",airline:"American Airlines",dist:247},
  {date:"2018-07-13",from:"SAT",to:"IAH",airline:"United Airlines",dist:190},
  {date:"2018-07-13",from:"IAH",to:"SFO",airline:"United Airlines",dist:1631},
  {date:"2018-07-11",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2018-07-07",from:"MIA",to:"IAH",airline:"United Airlines",dist:962},
  {date:"2018-07-07",from:"IAH",to:"SFO",airline:"United Airlines",dist:1631},
  {date:"2018-07-03",from:"SFO",to:"MIA",airline:"United Airlines",dist:2579},
  {date:"2018-06-29",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-06-28",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2018-06-26",from:"DEN",to:"SFO",airline:"United Airlines",dist:964},
  {date:"2018-06-24",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2018-06-20",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-06-18",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2018-06-18",from:"DEN",to:"DFW",airline:"United Airlines",dist:640},
  {date:"2018-06-14",from:"SJC",to:"SLC",airline:"Delta Air Lines",dist:583},
  {date:"2018-06-14",from:"SLC",to:"SJC",airline:"Delta Air Lines",dist:583},
  {date:"2018-06-07",from:"CDG",to:"SFO",airline:"United Airlines",dist:5565},
  {date:"2018-06-06",from:"AMS",to:"CDG",airline:"Air France",dist:247},
  {date:"2018-06-02",from:"SFO",to:"EWR",airline:"United Airlines",dist:2557},
  {date:"2018-06-02",from:"EWR",to:"AMS",airline:"United Airlines",dist:3644},
  {date:"2018-05-25",from:"DFW",to:"SFO",airline:"United Airlines",dist:1460},
  {date:"2018-05-23",from:"SFO",to:"DFW",airline:"United Airlines",dist:1460},
  {date:"2018-05-07",from:"CPH",to:"SFO",airline:"SAS",dist:5469},
  {date:"2018-05-01",from:"SFO",to:"CPH",airline:"SAS",dist:5469},
  {date:"2018-04-27",from:"CDG",to:"IAD",airline:"United Airlines",dist:3848},
  {date:"2018-04-27",from:"IAD",to:"SFO",airline:"United Airlines",dist:2411},
  {date:"2018-04-25",from:"KSC",to:"VIE",airline:"Austrian Airlines",dist:217},
  {date:"2018-04-25",from:"VIE",to:"CDG",airline:"Austrian Airlines",dist:642},
  {date:"2018-04-22",from:"LHR",to:"VIE",airline:"Austrian Airlines",dist:791},
  {date:"2018-04-22",from:"VIE",to:"KSC",airline:"Austrian Airlines",dist:217},
  {date:"2018-04-21",from:"SFO",to:"LHR",airline:"United Airlines",dist:5350},
  {date:"2018-04-08",from:"DEL",to:"FRA",airline:"Lufthansa",dist:3801},
  {date:"2018-04-08",from:"FRA",to:"SFO",airline:"Lufthansa",dist:5681},
  {date:"2018-04-04",from:"BLR",to:"MAA",airline:"Jet Airways",dist:166},
  {date:"2018-04-04",from:"MAA",to:"DEL",airline:"Jet Airways",dist:1093},
  {date:"2018-04-01",from:"FRA",to:"BLR",airline:"Lufthansa",dist:4596},
  {date:"2018-03-31",from:"SFO",to:"FRA",airline:"Lufthansa",dist:5681},
  {date:"2018-03-22",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2018-03-20",from:"ATL",to:"DAL",airline:"Delta Air Lines",dist:719},
  {date:"2018-03-19",from:"SFO",to:"ATL",airline:"Delta Air Lines",dist:2133},
  {date:"2018-03-15",from:"DEN",to:"SFO",airline:"United Airlines",dist:964},
  {date:"2018-03-14",from:"SFO",to:"DEN",airline:"United Airlines",dist:964},
  {date:"2018-03-13",from:"DFW",to:"SFO",airline:"American Airlines",dist:1460},
  {date:"2018-03-12",from:"SFO",to:"DFW",airline:"American Airlines",dist:1460},
  {date:"2018-03-08",from:"IAD",to:"SFO",airline:"United Airlines",dist:2411},
  {date:"2018-03-06",from:"SFO",to:"IAD",airline:"United Airlines",dist:2411},
  {date:"2018-02-01",from:"ORD",to:"SFO",airline:"United Airlines",dist:1840},
  {date:"2018-01-31",from:"SFO",to:"ORD",airline:"United Airlines",dist:1840},
  {date:"2018-01-26",from:"LHR",to:"SFO",airline:"United Airlines",dist:5350},
  {date:"2018-01-24",from:"FRA",to:"LHR",airline:"British Airways",dist:406},
  {date:"2018-01-22",from:"AMS",to:"FRA",airline:"Lufthansa",dist:227},
  {date:"2018-01-21",from:"LHR",to:"AMS",airline:"KLM",dist:230},
  {date:"2018-01-20",from:"SFO",to:"LHR",airline:"United Airlines",dist:5350},
  {date:"2018-01-18",from:"SAN",to:"SFO",airline:"United Airlines",dist:446},
  {date:"2018-01-16",from:"SFO",to:"SAN",airline:"United Airlines",dist:446},
  {date:"2018-01-11",from:"IAD",to:"SFO",airline:"United Airlines",dist:2411},
  {date:"2018-01-10",from:"YYZ",to:"IAD",airline:"United Airlines",dist:345},
  {date:"2018-01-09",from:"SFO",to:"YYZ",airline:"Air Canada",dist:2252},
  {date:"2017-03-02",from:"SYD",to:"SFO",airline:"United Airlines",dist:7425},
  {date:"2017-02-25",from:"CHC",to:"SYD",airline:"Emirates",dist:1320},
  {date:"2017-02-19",from:"AKL",to:"ZQN",airline:"United Airlines",dist:636},
  {date:"2017-02-17",from:"SFO",to:"AKL",airline:"United Airlines",dist:6526},
];

// Compute route data
const routeMap = new Map();
FLIGHTS.forEach(f => {
  if (!AIRPORTS[f.from] || !AIRPORTS[f.to]) return;
  const key = [f.from, f.to].sort().join('-');
  if (!routeMap.has(key)) {
    routeMap.set(key, { from: f.from, to: f.to, count: 0, flights: [] });
  }
  const r = routeMap.get(key);
  r.count++;
  r.flights.push(f);
});

// Compute airport flight counts
const airportCounts = {};
FLIGHTS.forEach(f => {
  [f.from, f.to].forEach(code => {
    if (AIRPORTS[code]) airportCounts[code] = (airportCounts[code] || 0) + 1;
  });
});

// ===========================
// THREE.JS SETUP
// ===========================

const canvas = document.getElementById('globe-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3.2);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x06070d);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;
controls.minDistance = 1.5;
controls.maxDistance = 6;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// ===========================
// GLOBE
// ===========================

const GLOBE_RADIUS = 1;

// Starfield
const starGeom = new THREE.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 50 + Math.random() * 50;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  starPositions[i * 3 + 2] = r * Math.cos(phi);
}
starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
scene.add(new THREE.Points(starGeom, new THREE.PointsMaterial({ color: 0x555577, size: 0.15, sizeAttenuation: true })));

// Globe sphere — dark with grid
const globeGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
const globeMat = new THREE.MeshBasicMaterial({
  color: 0x0a0e1a,
  transparent: true,
  opacity: 0.95,
});
const globe = new THREE.Mesh(globeGeom, globeMat);
scene.add(globe);

// Lat/Lng grid lines
const gridGroup = new THREE.Group();
const gridMat = new THREE.LineBasicMaterial({ color: 0x1a2040, transparent: true, opacity: 0.4 });

// Latitude lines
for (let lat = -60; lat <= 60; lat += 30) {
  const points = [];
  const phi = (90 - lat) * (Math.PI / 180);
  for (let lng = 0; lng <= 360; lng += 3) {
    const theta = lng * (Math.PI / 180);
    points.push(new THREE.Vector3(
      -(GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.cos(theta),
      (GLOBE_RADIUS + 0.001) * Math.cos(phi),
      (GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.sin(theta)
    ));
  }
  gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
}

// Longitude lines
for (let lng = 0; lng < 360; lng += 30) {
  const points = [];
  const theta = lng * (Math.PI / 180);
  for (let lat = -90; lat <= 90; lat += 3) {
    const phi = (90 - lat) * (Math.PI / 180);
    points.push(new THREE.Vector3(
      -(GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.cos(theta),
      (GLOBE_RADIUS + 0.001) * Math.cos(phi),
      (GLOBE_RADIUS + 0.001) * Math.sin(phi) * Math.sin(theta)
    ));
  }
  gridGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), gridMat));
}
scene.add(gridGroup);

// Atmosphere glow
const atmosGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
const atmosMat = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      gl_FragColor = vec4(0.15, 0.3, 0.5, 1.0) * intensity * 0.6;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
});
scene.add(new THREE.Mesh(atmosGeom, atmosMat));

// ===========================
// HELPER: lat/lng to 3D
// ===========================

function latLngToVector3(lat, lng, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// ===========================
// AIRPORT DOTS (InstancedMesh)
// ===========================

const airportCodes = Object.keys(AIRPORTS).filter(c => c !== 'Priv');
const dotGeom = new THREE.SphereGeometry(0.008, 8, 8);
const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const dotMesh = new THREE.InstancedMesh(dotGeom, dotMat, airportCodes.length);

// Glow dots
const glowGeom = new THREE.SphereGeometry(0.016, 8, 8);
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
const glowMesh = new THREE.InstancedMesh(glowGeom, glowMat, airportCodes.length);

const dotPositions = []; // for raycasting
const dummy = new THREE.Object3D();

airportCodes.forEach((code, i) => {
  const ap = AIRPORTS[code];
  const region = getRegion(code);
  const color = new THREE.Color(REGIONS[region]?.color || '#ffffff');
  const pos = latLngToVector3(ap.lat, ap.lng, GLOBE_RADIUS + 0.003);

  dummy.position.copy(pos);
  // Scale based on flight count
  const count = airportCounts[code] || 1;
  const scale = Math.min(1 + count * 0.03, 2.5);
  dummy.scale.setScalar(scale);
  dummy.updateMatrix();

  dotMesh.setMatrixAt(i, dummy.matrix);
  dotMesh.setColorAt(i, color);
  glowMesh.setMatrixAt(i, dummy.matrix);
  glowMesh.setColorAt(i, color);

  dotPositions.push({ code, position: pos.clone(), index: i, region });
});

dotMesh.instanceMatrix.needsUpdate = true;
dotMesh.instanceColor.needsUpdate = true;
glowMesh.instanceMatrix.needsUpdate = true;
glowMesh.instanceColor.needsUpdate = true;
scene.add(dotMesh);
scene.add(glowMesh);

// ===========================
// FLIGHT ARCS
// ===========================

const arcGroup = new THREE.Group();
scene.add(arcGroup);

function createArc(fromCode, toCode, color, opacity = 0.35, lineWidth = 1) {
  const from = AIRPORTS[fromCode];
  const to = AIRPORTS[toCode];
  if (!from || !to) return null;

  const start = latLngToVector3(from.lat, from.lng, GLOBE_RADIUS + 0.004);
  const end = latLngToVector3(to.lat, to.lng, GLOBE_RADIUS + 0.004);
  const dist = start.distanceTo(end);
  const mid = start.clone().add(end).multiplyScalar(0.5);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + 0.004 + dist * 0.25);

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(48);
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Line(geom, mat);
}

// Build all arcs
const arcObjects = [];
routeMap.forEach((route, key) => {
  const fromRegion = getRegion(route.from);
  const toRegion = getRegion(route.to);
  // Use the color of the more "interesting" (non-NA) endpoint, or the from
  const region = fromRegion !== 'north-america' ? fromRegion : toRegion;
  const color = REGIONS[region]?.color || '#448aff';
  const opacity = Math.min(0.15 + route.count * 0.04, 0.6);
  const arc = createArc(route.from, route.to, color, opacity);
  if (arc) {
    arc.userData = { key, from: route.from, to: route.to, count: route.count, flights: route.flights, region };
    arcGroup.add(arc);
    arcObjects.push(arc);
  }
});

// ===========================
// COUNTRY OUTLINES (from TopoJSON)
// ===========================

async function loadCountryOutlines() {
  try {
    const topoResp = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    const topo = await topoResp.json();

    // Manual TopoJSON decode
    const transform = topo.transform;
    const arcs = topo.arcs.map(arc => {
      let x = 0, y = 0;
      return arc.map(([dx, dy]) => {
        x += dx; y += dy;
        return [
          x * transform.scale[0] + transform.translate[0],
          y * transform.scale[1] + transform.translate[1]
        ];
      });
    });

    const countries = topo.objects.countries;
    const geometries = countries.geometries;

    const outlineMat = new THREE.LineBasicMaterial({
      color: 0x1a3050,
      transparent: true,
      opacity: 0.5,
    });

    const outlineGroup = new THREE.Group();

    function decodeRing(indices) {
      let coords = [];
      indices.forEach(idx => {
        const arcCoords = idx >= 0 ? arcs[idx] : arcs[~idx].slice().reverse();
        coords = coords.concat(arcCoords);
      });
      return coords;
    }

    geometries.forEach(geom => {
      let rings = [];
      if (geom.type === 'Polygon') {
        rings = geom.arcs.map(ring => decodeRing(ring));
      } else if (geom.type === 'MultiPolygon') {
        geom.arcs.forEach(poly => {
          poly.forEach(ring => rings.push(decodeRing(ring)));
        });
      }

      rings.forEach(coords => {
        if (coords.length < 3) return;
        const points = coords.map(([lng, lat]) =>
          latLngToVector3(lat, lng, GLOBE_RADIUS + 0.002)
        );
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        outlineGroup.add(new THREE.Line(geom, outlineMat));
      });
    });

    scene.add(outlineGroup);
  } catch (e) {
    console.warn('Could not load country outlines:', e);
  }
}

loadCountryOutlines();

// ===========================
// TOOLTIP / RAYCASTING
// ===========================

const tooltip = document.getElementById('tooltip');
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
raycaster.params.Points = { threshold: 0.05 };

let hoveredAirport = null;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Find nearest airport dot
  let closest = null;
  let closestDist = 30; // pixels

  dotPositions.forEach(dp => {
    const screenPos = dp.position.clone().project(camera);
    const sx = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;
    const dist = Math.hypot(event.clientX - sx, event.clientY - sy);

    // Check if dot is on front of globe (not behind)
    const dotDir = dp.position.clone().normalize();
    const camDir = camera.position.clone().normalize();
    if (dotDir.dot(camDir) < -0.1) return; // behind globe

    if (dist < closestDist) {
      closestDist = dist;
      closest = dp;
    }
  });

  if (closest) {
    const ap = AIRPORTS[closest.code];
    const region = closest.region;
    const color = REGIONS[region]?.color || '#fff';
    const flightCount = airportCounts[closest.code] || 0;

    tooltip.innerHTML = `
      <span class="tooltip-dot" style="background:${color}"></span>
      <span class="tooltip-info">
        <span class="tooltip-city">${ap.city} (${closest.code})</span>
        <span class="tooltip-detail">${ap.country} · ${flightCount} flights</span>
      </span>
    `;
    tooltip.classList.add('visible');
    tooltip.style.left = (event.clientX + 16) + 'px';
    tooltip.style.top = (event.clientY - 16) + 'px';
    canvas.style.cursor = 'pointer';
    hoveredAirport = closest;
  } else {
    tooltip.classList.remove('visible');
    canvas.style.cursor = 'grab';
    hoveredAirport = null;
  }
}

canvas.addEventListener('mousemove', onMouseMove);
canvas.addEventListener('mouseleave', () => {
  tooltip.classList.remove('visible');
  hoveredAirport = null;
});

// ===========================
// LEGEND
// ===========================

const legendToggle = document.getElementById('legend-toggle');
const legendEl = document.getElementById('legend');
const legendItems = document.getElementById('legend-items');

// Count airports per region
const regionCounts = {};
airportCodes.forEach(code => {
  const r = getRegion(code);
  regionCounts[r] = (regionCounts[r] || 0) + 1;
});

const activeRegions = new Set(Object.keys(REGIONS));

Object.entries(REGIONS).forEach(([key, { label, color }]) => {
  const item = document.createElement('div');
  item.className = 'legend-item';
  item.dataset.region = key;
  item.innerHTML = `
    <span class="legend-dot" style="background:${color}"></span>
    <span>${label}</span>
    <span class="legend-count">${regionCounts[key] || 0}</span>
  `;
  item.addEventListener('click', () => {
    if (activeRegions.has(key)) {
      activeRegions.delete(key);
      item.classList.add('dimmed');
    } else {
      activeRegions.add(key);
      item.classList.remove('dimmed');
    }
    updateVisibility();
  });
  legendItems.appendChild(item);
});

legendToggle.addEventListener('click', () => {
  legendEl.classList.toggle('open');
});

// ===========================
// YEAR FILTER
// ===========================

let activeYear = 'all';
const yearBtns = document.querySelectorAll('.year-btn');

yearBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    yearBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeYear = btn.dataset.year;
    updateVisibility();
  });
});

// ===========================
// VISIBILITY UPDATES
// ===========================

function updateVisibility() {
  // Filter flights
  const filteredFlights = FLIGHTS.filter(f => {
    if (activeYear !== 'all' && !f.date.startsWith(activeYear)) return false;
    return true;
  });

  // Compute visible airports and routes
  const visibleAirports = new Set();
  const visibleRouteKeys = new Set();

  filteredFlights.forEach(f => {
    if (!AIRPORTS[f.from] || !AIRPORTS[f.to]) return;
    const fromRegion = getRegion(f.from);
    const toRegion = getRegion(f.to);
    if (activeRegions.has(fromRegion)) visibleAirports.add(f.from);
    if (activeRegions.has(toRegion)) visibleAirports.add(f.to);

    // Show arc if either end is in an active region
    if (activeRegions.has(fromRegion) || activeRegions.has(toRegion)) {
      visibleRouteKeys.add([f.from, f.to].sort().join('-'));
      visibleAirports.add(f.from);
      visibleAirports.add(f.to);
    }
  });

  // Update dots
  airportCodes.forEach((code, i) => {
    const region = getRegion(code);
    const visible = visibleAirports.has(code) && activeRegions.has(region);
    const color = visible ? new THREE.Color(REGIONS[region]?.color || '#fff') : new THREE.Color(0x000000);
    const scale = visible ? Math.min(1 + (airportCounts[code] || 1) * 0.03, 2.5) : 0.001;

    const pos = latLngToVector3(AIRPORTS[code].lat, AIRPORTS[code].lng, GLOBE_RADIUS + 0.003);
    dummy.position.copy(pos);
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();

    dotMesh.setMatrixAt(i, dummy.matrix);
    dotMesh.setColorAt(i, color);
    glowMesh.setMatrixAt(i, dummy.matrix);
    glowMesh.setColorAt(i, color);
  });

  dotMesh.instanceMatrix.needsUpdate = true;
  dotMesh.instanceColor.needsUpdate = true;
  glowMesh.instanceMatrix.needsUpdate = true;
  glowMesh.instanceColor.needsUpdate = true;

  // Update arcs
  arcObjects.forEach(arc => {
    arc.visible = visibleRouteKeys.has(arc.userData.key);
  });

  // Update stats
  updateStats(filteredFlights);
}

function updateStats(flights) {
  const airports = new Set();
  const airlines = new Set();
  let totalDist = 0;
  const continents = new Set();

  flights.forEach(f => {
    airports.add(f.from);
    airports.add(f.to);
    airlines.add(f.airline);
    totalDist += f.dist || 0;
    [f.from, f.to].forEach(code => {
      if (AIRPORTS[code]) {
        const r = getRegion(code);
        if (r !== 'other') continents.add(r);
      }
    });
  });

  document.querySelectorAll('.stat-number').forEach(el => {
    const format = el.dataset.format;
    let target;
    if (format === 'miles') target = totalDist;
    else if (el.closest('.stat')?.querySelector('.stat-label')?.textContent === 'Flights') target = flights.length;
    else if (el.closest('.stat')?.querySelector('.stat-label')?.textContent === 'Airports') target = airports.size;
    else if (el.closest('.stat')?.querySelector('.stat-label')?.textContent === 'Airlines') target = airlines.size;
    else if (el.closest('.stat')?.querySelector('.stat-label')?.textContent === 'Continents') target = continents.size;
    else return;

    animateNumber(el, target, format === 'miles');
  });
}

// ===========================
// ANIMATE NUMBERS
// ===========================

function animateNumber(el, target, isMiles = false) {
  const current = parseInt(el.textContent.replace(/,/g, '')) || 0;
  if (current === target) return;

  const duration = 800;
  const start = performance.now();
  const startVal = current;

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.round(startVal + (target - startVal) * ease);
    el.textContent = isMiles ? val.toLocaleString() : val.toLocaleString();
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Initial number animation
setTimeout(() => {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const format = el.dataset.format;
    animateNumber(el, target, format === 'miles');
  });
}, 300);

// ===========================
// ANIMATE
// ===========================

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Pulse glow
  const pulse = 0.3 + Math.sin(performance.now() * 0.002) * 0.1;
  glowMat.opacity = pulse;

  renderer.render(scene, camera);
}

animate();

// ===========================
// RESIZE
// ===========================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
