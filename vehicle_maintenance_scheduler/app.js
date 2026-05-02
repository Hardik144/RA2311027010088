require("dotenv").config();
const executeScheduler = require("./service");


executeScheduler(process.env.TOKEN);