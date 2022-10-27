const NodeGeocoder = require('node-geocoder');

const options = {
  provider: "mapquest",
  apiKey: "fpccV7GZkymTtSUfMvkguGNwivae1pnO",
  formatter: null // 'gpx', 'string', ...
};

 const geocoder = NodeGeocoder(options);

module.exports=geocoder;