import express from "express";
import {getFloorSpots,getAvailableFloorSpots,setBookingSpot} from "../controllers/fireStoreController.js";


const fireStoreRouter = express.Router();


fireStoreRouter.get("/FloorSpots", getFloorSpots);
fireStoreRouter.get("/AvailableFloorSpots", getAvailableFloorSpots);
fireStoreRouter.post("/BookingSpot", setBookingSpot);



export default fireStoreRouter;