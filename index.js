import express from "express";
import http from "http";
import Config from "./configs/config.js";
import "./configs/firebaseConfig.js";
import fireStoreRouter from "./routes/fireStoreRoutes.js";
import { startSheduler } from "./controllers/Taskscheduler.js";
//https://slate-gray-mackerel-tam.cyclic.app
// https://slate-gray-mackerel-tam.cyclic.app/fireStore/AvailableFloorSpots/

/* ...............parmeters...................... */
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use("/fireStore", fireStoreRouter);

/*............listen server.........................*/
server.listen(Config.port, () => {
  console.log(`\n..... Server Runing Port ${Config.port} .....\n`);
});

/*..................Start Sheduler....................*/

startSheduler();

/*..................Routing....................*/
app.get("/", (request, response) => {
  response.send("......... Auto Spotter API .........");
});
