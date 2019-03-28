
function parsePageSpeedResults(res) {
    const { audits, categories } = res.data.lighthouseResult;
    return {
      fetchTime: res.data.lighthouseResult.fetchTime,
      score: categories.performance.score,
      metrics: audits.metrics.details.items[0],
    }
}

module.exports = {
  parsePageSpeedResults,
}