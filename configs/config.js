

const SERVICEACCOUNT  = "../autospotter-ad598-firebase-adminsdk-8eves-9dfb8c2a59.json";
const DATABASEURL= "https://autospotter-ad598-default-rtdb.firebaseio.com";
const PORT = process.env.PORT || 3000;

// Cloud Firestore Collections 
const COLLECTIONSREFS = {
  PARKING: "POPULAR_PARKING",
  GATES: "GATES",
  FLOORS: "FLOORS",
  SPOTS: "SPOTS",
  BOOKINGS: "BOOKINGS"

};

export default{
    port:PORT,
    serviceAccount:SERVICEACCOUNT,
    databaseURL:DATABASEURL,
    collectionsRefs:COLLECTIONSREFS
}