const { stopSessionUpdater, updateSessionStatus } = require('../utils/SessionUpdater.js');

module.exports = {
  name: "clientReady",
  async execute(client) {
    try {
      stopSessionUpdater();
      await updateSessionStatus(client);
      console.log("Session updater stopped and session status updated successfully.");
    } catch (error) {
      console.error("Error on stop and update session status:", error);
    }
  }
};
