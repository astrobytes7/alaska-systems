const { startSessionUpdater, stopSessionUpdater } = require('../utils/SessionUpdater.js');

module.exports = {
  name: "ready",
  async execute(client) {
    try {
      stopSessionUpdater();                 // clear any stale intervals first
      startSessionUpdater(client);          // start the 1-second guard + 60-second stats refresh
      console.log("[SessionChecker] Session embed guard and stat updater started.");
    } catch (error) {
      console.error("[SessionChecker] Error starting session updater:", error);
    }
  }
};
