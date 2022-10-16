const nodeGeocoder = require('node-geocoder');



const options = {
    provider: process.env.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    // Optional depending on the providers
    apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
  };



  const geoCoder = nodeGeocoder(options);

  module.exports = geoCoder;