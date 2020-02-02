const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
//const firebase = require('firebase');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.getTickets = functions.https.onRequest((req, res) => {
  if(req.method !== 'GET'){
    return res.status(400).json({ error: 'Bad request: Must use GET'});
  }
  admin.firestore().collection('tickets').get()
    .then( data => {
      let tickets = [];
      data.forEach(doc => {
        tickets.push(doc.data());
      });
      return res.json(tickets);
    })
    .catch(err => console.error(err));
});

exports.createTicket = functions.https.onRequest((req, res) => {
  if(req.method !== 'POST'){
    return res.status(400).json({ error: 'Bad request: Must use POST'});
  }
  const newTicket = {
    description: req.body.description,
    priority: 1,
    submit_time: admin.firestore.Timestamp.fromDate(new Date()),
    special_insns: req.body.special_insns
  };

  admin.firestore()
  .collection('tickets')
  .add(newTicket)
  .then(doc => {
    return res.json({message: `document ${doc.id} created successfully`});
  })
  .catch( err => {
    res.status(500).json({error: 'something went wrong'});
    console.error(err);
  })
});
