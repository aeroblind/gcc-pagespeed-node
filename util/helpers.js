
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

module.exports = {
  parsePageSpeedResults,
}