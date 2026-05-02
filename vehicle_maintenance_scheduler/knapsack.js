function calculateMaxImpact(tasks, capacity) {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < tasks.length; i++) {
    const duration = tasks[i].Duration;
    const impact = tasks[i].Impact;

    for (let j = capacity; j >= duration; j--) {
      const include = impact + dp[j - duration];
      const exclude = dp[j];
      dp[j] = include > exclude ? include : exclude;
    }
  }

  return dp[capacity];
}

module.exports = calculateMaxImpact;