const moment = require('moment');

function parsePageSpeedResults(data) {

    if (!data) {
      return;
    }

    const { fetchTime, audits, categories } = data.lighthouseResult;

    if (!fetchTime || !audits || !categories) {
      return;
    }

    return {
      fetchTime: data.lighthouseResult.fetchTime,
      score: categories.performance.score,
      metrics: audits.metrics.details.items[0]
    }
}


function isValidDateFormat(date, format) {
  return moment(date, format, true).isValid();
}

module.exports = {
  parsePageSpeedResults,
  isValidDateFormat,
}