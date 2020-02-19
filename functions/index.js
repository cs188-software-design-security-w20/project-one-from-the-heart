const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');
const FBAuthWorker = require('./util/fbAuthWorker')

//CORS
const cors = require('cors');
app.use(cors());

const { getAllTickets, postOneTicket, getWorkersTickets, getTenantTickets, closeTicket } = require('./handlers/tickets');
const{signup, login, editAccount} = require('./handlers/users');

// // https://firebase.google.com/docs/functions/write-firebase-functions

// Ticket Routes
//only the landlord (or worker?) can fetch all tickets
app.get('/tickets',/*FBAuthLL,*/ getAllTickets);
app.delete('/ticket/:ticket_id', FBAuthWorker, closeTicket);
// app.post('/assign_to_worker', FBAuthLL, assignTickets);
// app.post('/unnasign_from_worker', FBAuthLL, unassignTickets);
// app.delete('/delete_ticket', FBAuthLL, deleteTicket);
app.post('/ticket', FBAuth, postOneTicket);

//User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/edit_account', FBAuth, editAccount);

//Tenant Routes
app.get('/tenant_tickets', FBAuth, getTenantTickets);

//Worker Routes
app.get('/worker_tickets', FBAuthWorker, getWorkersTickets);
app.post('/close_ticket', FBAuthWorker, closeTicket);

//Landlord Routes
// app.post('/verify_tenant', FBAuthLL, verifyTenant);
// app.post('/verify_worker', FBAuthLL, verifyWorker);
// app.post('/suspend_tenant', FBAuthLL, suspendTenant);
// app.post('/suspend_worker', FBAuthLL, suspendWorker);
// app.delete('/delete_user', FBAuthLL, deleteUser);


exports.api = functions.https.onRequest(app);
