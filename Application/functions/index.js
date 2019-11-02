const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const authenticate = require("./middleware/authenticate");

admin.initializeApp();

const app = express();

app.use(authenticate); // firebase authentication middleware

exports.addUser = functions.https.onRequest(async (req, res) => {
  console.log("Setting CORS header");
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    console.log("Setting CORS preflight options");
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");

    res.status(201).send("CORS preflight options set!");
  } else {
    // Starting storage of userData
    const db = admin.firestore();
    const { uid, email, username, photoURL, name } = req.body;
    console.log("Here is req.body: ", req.body);

    const data = {
      email: email,
      name: name,
      username: username,
      photo: photoURL,
      dateCreated: admin.firestore.Timestamp.now()
    };
    console.log("Here is userData: ", data);
    try {
      let setUser = await db
        .collection("users")
        .doc(uid)
        .set(data);
      console.log("Successfully created user!\n");
      console.log(setUser);
      console.log("User created at: ", setUser.writeTime);
      res.status(201).send("User added to database!");
    } catch (error) {
      console.log("Error Storing user in database \n");
      console.log(error);
      res.status(400).send("Bad Request");
    }
  }
});

exports.getUser = functions.https.onRequest(async (req, res) => {
  console.log("Setting CORS header");
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    console.log("Setting CORS preflight options");
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");

    res.status(201).send("CORS preflight options set!");
  } else {
    const db = admin.firestore();
    const { uid } = req.body;
    console.log("Here is req.body: ", req.body);

    let docRef = db.collection("users").doc(uid);

    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          res.status(201).send(doc.data());
          return doc.data();
        } else {
          // doc.data() will be undefined in this case
          res.status(400).send("Bad Request");
          return console.log("No such user!");
        }
      })
      .catch(function(error) {
        res.status(400).send("Bad Request");
        return console.log("Error getting user:", error);
      });
  }
});
