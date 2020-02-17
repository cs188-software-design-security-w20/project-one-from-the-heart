const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');
const FBAuthWorker = require('./util/fbAuthWorker')

//CORS
const cors = require('cors');
app.use(cors());

const { getAllTickets, postOneTicket, getWorkersTickets, closeTicket } = require('./handlers/tickets');
const{signup, login} = require('./handlers/users');

// // https://firebase.google.com/docs/functions/write-firebase-functions

// Tickets routes
app.get('/tickets', getAllTickets);
app.post('/ticket', FBAuth, postOneTicket);
app.delete('/ticket/:ticket_id', FBAuthWorker, closeTicket);
//Worker routes
app.get('/worker_tickets', FBAuthWorker, getWorkersTickets);

// Users Routes
app.post('/signup', signup);
app.post('/login', login);

exports.api = functions.https.onRequest(app);
