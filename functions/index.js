const functions = require('firebase-functions');
const app = require('express')();
const { FBAuth, FBAuthWorker, FBAuthLL } = require('./util/fbAuth');

//CORS
const cors = require('cors');
app.use(cors());

const { getAllTickets, postOneTicket, getWorkersTickets, getTenantTickets, deleteTicket } = require('./handlers/tickets');
const{signup, login, editAccount} = require('./handlers/users');
const { verifyWorker } = require('./handlers/landlord')
const { closeTicket, assignTicket, unassignTicket } = require('./handlers/worker')

// // https://firebase.google.com/docs/functions/write-firebase-functions

// Ticket Routes
//only the landlord (or worker?) can fetch all tickets
app.get('/tickets',/*FBAuthLL,*/ getAllTickets);
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
app.get('/close_ticket/:ticket_id', FBAuthWorker, closeTicket);
app.get('/assignTicket/:ticket_id', FBAuthWorker, assignTicket);
app.get('/unassignTicket/:ticket_id',FBAuthWorker, unassignTicket);

//Landlord Routes
//app.post('/verify_tenant', FBAuthLL, verifyTenant);
app.get('/verify_worker/:worker_email', FBAuthLL, verifyWorker);
// app.post('/suspend_tenant', FBAuthLL, suspendTenant);
// app.post('/suspend_worker', FBAuthLL, suspendWorker);
// app.delete('/delete_user', FBAuthLL, deleteUser);
//app.delete('/delete_ticket/:ticket_id', FBAuthLL, deleteTicket);


exports.api = functions.https.onRequest(app);
