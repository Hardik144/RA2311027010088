const axios = require("axios");
const Log = require("../logging_middleware/logger");
const calculateMaxImpact = require("./knapsack");

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function executeScheduler(token) {
  try {
    await Log("backend", "info", "controller", "Starting scheduler execution");

    const depotResponse = await axios.get(`${BASE_URL}/depots`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await Log("backend", "info", "controller", "Depot data fetched");

    const vehicleResponse = await axios.get(`${BASE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await Log("backend", "info", "controller", "Vehicle data fetched");

    const depots = depotResponse.data.depots;
    const tasks = vehicleResponse.data.vehicles;

    for (let depot of depots) {
      await Log("backend", "debug", "domain", `Processing depot ${depot.ID}`);

      const bestImpact = calculateMaxImpact(tasks, depot.MechanicHours);

      await Log(
        "backend",
        "info",
        "controller",
        `Depot ${depot.ID} max impact calculated`
      );
    }

    await Log("backend", "info", "controller", "Scheduler completed successfully");

  } catch (error) {
    await Log("backend", "error", "controller", `Scheduler failed: ${error.message}`);
  }
}


module.exports = executeScheduler;