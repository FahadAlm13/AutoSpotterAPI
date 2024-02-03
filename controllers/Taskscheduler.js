import { db } from "../configs/firebaseConfig.js";
import Config from "../configs/config.js";
import {
  collection,
  updateDoc,
  doc,
  query,
  getDocs,
  Timestamp,
  where,
} from "firebase/firestore";

// ............................................................مراقب جدول المهام

const TimeIntervalMinutes = 30;
const TimeIntervalMilliseconds = TimeIntervalMinutes * 60 * 1000;

export const getCurrentDateTimeZoneRiyadh = () => {
  const localDate = new Date()
    .toLocaleString("en-GB", { timeZone: "Asia/Riyadh" })
    .replace(/,/g, "");
  const [, day, month, year, hours, minutes, seconds] = localDate.match(
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/
  );
  const date = new Date(year, month - 1, day, hours, minutes, seconds);
  return date;
};

// ............................................................

export const getUnavailableBooked = async () => {
  let errorMsg = null;
  let dataList = null;
  try {
    let q = query(
      collection(db, Config.collectionsRefs.BOOKINGS),
      where("status", "==", "unavailable")
    );

    let querySnapshot = await getDocs(q);
    dataList = querySnapshot.docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    return { dataList, errorMsg };
  } catch (error) {
    errorMsg = error.message;
    return { dataList, errorMsg };
  }
};

// ............................................................

const changeBookingStatus = async () => {
  const { dataList, errorMsg } = await getUnavailableBooked();
  if (errorMsg == null) {
    for (let index = 0; index < dataList.length; index++) {
      const booking = dataList[index];
      const docRef = doc(db, Config.collectionsRefs.BOOKINGS, booking.id);
      const currentTimestamp = Timestamp.fromMillis(
        getCurrentDateTimeZoneRiyadh().getTime()
      );
      if (currentTimestamp >= booking.endDate) {
        await updateDoc(docRef, {
          status: "complete",
        });
      }
    }
  } else {
    console.log("................... Error ...................");
    console.log(errorMsg);
    console.log(".............................................");
  }
};

// ............................................................

export const startSheduler = () => {
  setInterval(async () => {
    await changeBookingStatus();
  }, TimeIntervalMilliseconds);
};

// ............................................................
