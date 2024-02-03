import { db } from "../configs/firebaseConfig.js";
import Config from "../configs/config.js";
import {
  collection,
  addDoc,
  query,
  getDocs,
  Timestamp,
  where,
} from "firebase/firestore";

// ............................................................

const getSpots = async (floorId) => {
  let errorMsg = null;
  let spots = [];

  try {
    const q = query(
      collection(db, Config.collectionsRefs.SPOTS),
      where("floorId", "==", floorId)
    );
    const querySnapshot = await getDocs(q);
    spots = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    return { spots, errorMsg };
  } catch (error) {
    errorMsg = error.message;
    return { spots, errorMsg };
  }
};

// ............................................................

const isAvailableSpots = async (spotId, startDate, endDate) => {
  let errorMsg = null;
  let isAvailable = null;

  try {
    let q = query(
      collection(db, Config.collectionsRefs.BOOKINGS),
      where("spotId", "==", spotId)
    );

    let querySnapshot = await getDocs(q);
    let flag = true;
    querySnapshot.docs.forEach((doc) => {
      let data = { ...doc.data(), id: doc.id };
      if (
        data.startDate >= startDate &&
        data.endDate <= endDate &&
        data.status != "available"
      ) {
        flag = false;
      }
    });

    isAvailable = flag;
    return { isAvailable, errorMsg };
  } catch (error) {
    errorMsg = error.message;
    return { isAvailable, errorMsg };
  }
};

// ............................(/fireStore/FloorSpots)................................

export const getFloorSpots = async (req, res) => {
  const floorId = req.query.floorId;
  if (floorId == undefined) {
    res.status(400).send("Error body Parme floorId");
    return;
  }
  const { spots, errorMsg } = await getSpots(floorId);
  if (errorMsg == null) {
    res.status(200).send({ spots });
  } else {
    res.status(400).send({ errorMsg });
  }
};

// ......................(/fireStore/AvailableFloorSpots)......................................

export const getAvailableFloorSpots = async (req, res) => {
  let floorId = req.query.floorId;
  let startDate = parseFloat(req.query.startDate);
  let endDate = parseFloat(req.query.endDate);

  if (isNaN(startDate) || isNaN(endDate) || floorId == undefined) {
    res
      .status(400)
      .send({ errorMsg: `Error body Parmes (floorId,startDate,endDate)` });
    return;
  }

  const { spots, errorMsg } = await getSpots(floorId);

  //   const startDate = new Timestamp(1706736600, 869000000);
  //   const endDate = new Timestamp(1706740200, 728000000);

  if (errorMsg == null) {
    try {
      startDate = Timestamp.fromMillis(startDate);
      endDate = Timestamp.fromMillis(endDate);
      let spotsAvailable = [];

      for (let index = 0; index < spots.length; index++) {
        const spot = spots[index];
        const { isAvailable, errorMsg } = await isAvailableSpots(
          spot.id,
          startDate,
          endDate
        );
        if (errorMsg == null) {
          if (isAvailable) {
            spotsAvailable.push(spot);
          }
        } else {
          res.status(400).send({ errorMsg: errorMsg });
          return;
        }
      } //end for...

      res.status(200).send({ spotsAvailable: spotsAvailable });
    } catch (error) {
      res.status(400).send({ errorMsg: error.message });
    }
  } else {
    res.status(400).send({ errorMsg: errorMsg });
  }
};

// ......................(/fireStore/BookingSpot)......................................

export const setBookingSpot = async (req, res) => {
  let data = { ...req.body, status: "unavailable" };
  data.startDate = Timestamp.fromMillis(data.startDate);
  data.endDate = Timestamp.fromMillis(data.endDate);
  let docId = null;
  let msg = null;
  try {
    const { isAvailable, errorMsg } = await isAvailableSpots(
      data.spotId,
      data.startDate,
      data.endDate
    );
    if (errorMsg == null) {
      if (isAvailable) {
        const docRef = await addDoc(
          collection(db, Config.collectionsRefs.BOOKINGS),
          data
        );
        msg = "Spot Booked Successfully";
        docId = docRef.id;
        res.status(200).send({ docId, msg });
      } else {
        msg =
          "Sorry, the selected spot is not available at the specified time, please select another time or select another spot.";
        res.status(400).send({ docId, msg });
      }
    } else {
      msg = errorMsg;
      res.status(400).send({ docId, msg });
    }
  } catch (error) {
    msg = error.message;
    res.status(400).send({ docId, msg });
  }
};
