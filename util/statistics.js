const moment = require('moment');

function getStatistics(values) {
  const avg = calculateAverage(values);
  const median = calculateMedian(values);
  return {
    avg,
    median
  }
}

function calculateAverage(values) {
  let sum = 0;
  let avg = 0;
  if (values.length) {
    sum = values.reduce((a,b) => { return (a + b) });
    avg = sum/values.length;
  }
  return avg;
}

function calculateMedian(values){
  if(values.length ===0) return 0;

  values.sort(function(a,b){
    return a-b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}


module.exports = {
  getStatistics
}