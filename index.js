const { nextISSTimesForMyLocation } = require('./iss');


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  const timesArray = passTimes.response;
  for (let i = 0; i < timesArray.length; i++) {
    let date = new Date(1000 * timesArray[i].risetime);
    let length = timesArray[i].duration;
    console.log(`Next pass at ${date} for ${length} seconds!`);

  }
});
