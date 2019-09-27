const request = require('request');



const fetchMyIP = function(callback) {
  request.get('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const spotterIp = JSON.parse(body).ip;
    return callback(null, spotterIp);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request.get(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const coordinates = {
      latitude: JSON.parse(body).data.latitude,
      longitude: JSON.parse(body).data.longitude
    };
    callback(null, coordinates);
    return;
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const lon = coords.longitude;
  request.get(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, (error, response, body) => {
    if (error) {
      callback(error,null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOverTimes = JSON.parse(body);
    return callback(null, flyOverTimes);
  });
};

const nextISSTimesForMyLocation = (someCallBack) => {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      someCallBack(error, null);
      return;
    }
    console.log('It worked! Returned IP:' , ip);
    const spotterIp = ip;
    fetchCoordsByIP(spotterIp, (error, coordinates) => {
      if (error) {
        console.log("It didn't work!", error);
        return;
      }
      console.log('It worked! Returned coordinates: ', coordinates);
      const coord = coordinates;
      fetchISSFlyOverTimes(coord, (error, data) => {
        if (error) {
          console.log("It didn't work!", error);
          return;
        }
        console.log('It worked! Returned flyover times: ');
        someCallBack(null, data);
        return;
      });

    });

  });
}



module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };