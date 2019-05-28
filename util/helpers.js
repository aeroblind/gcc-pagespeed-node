
function parsePageSpeedResults(res) {
    const { audits, categories } = res.data.lighthouseResult;
    let metrics = null;
    try {
      metrics = audits.metrics.details.items[0]
    } catch (err) {
      console.log("Metrics not found");
      console.error(err);
    }
    return {
      fetchTime: res.data.lighthouseResult.fetchTime,
      score: categories.performance.score,
      metrics: metrics,
    }
}

module.exports = {
  parsePageSpeedResults,
}