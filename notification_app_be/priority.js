require("dotenv").config();
const axios = require("axios");

// API URL
const NOTIFICATION_API = "http://20.207.122.201/evaluation-service/notifications";

// Priority weights
const priorityWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function fetchAndProcessNotifications() {
  try {
    const response = await axios.get(NOTIFICATION_API, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
    });

    const notifications = response.data.notifications;

    if (!notifications || notifications.length === 0) {
      console.log("No notifications found.");
      return;
    }

    // Sort logic: Priority first, then latest timestamp
    const sorted = notifications.sort((a, b) => {
      const priorityDiff =
        priorityWeight[b.Type] - priorityWeight[a.Type];

      if (priorityDiff !== 0) return priorityDiff;

      return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    // Get top 10
    const top10 = sorted.slice(0, 10);

    console.log("🔝 Top 10 Priority Notifications:\n");

    top10.forEach((n, index) => {
      console.log(
        `${index + 1}. [${n.Type}] ${n.Message} (${n.Timestamp})`
      );
    });

  } catch (error) {
    console.error("Error fetching notifications:", error.message);
  }
}

fetchAndProcessNotifications();