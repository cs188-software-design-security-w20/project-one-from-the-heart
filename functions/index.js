const functions = require('firebase-functions');
const app = require('express')();
const { FBAuth, FBAuthWorker, FBAuthLL } = require('./util/fbAuth');

//CORS
const cors = require('cors');
app.use(cors());

const { getAllTickets, postOneTicket, getAssignedTickets, getUnnassignedTickets, getTenantTickets, deleteTicket } = require('./handlers/tickets');
const{signup, login, editAccount, viewProfile} = require('./handlers/users');
const { verifyWorker, verifyTenant, suspendTenant, suspendWorker } = require('./handlers/landlord')
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
app.get('/view_profile',FBAuth, viewProfile);
//app.post('/delete_account', FBAuth, deleteAccount)

//Tenant Routes
app.get('/tenant_tickets', FBAuth, getTenantTickets);

//Worker Routes
app.get('/assigned_tickets', FBAuthWorker, getAssignedTickets);
app.get('/unnassigned_tickets', FBAuthWorker, getUnnassignedTickets);
app.post('/close_ticket/:ticket_id', FBAuthWorker, closeTicket);
app.post('/assign_ticket/:ticket_id', FBAuthWorker, assignTicket);
app.post('/unassign_ticket/:ticket_id',FBAuthWorker, unassignTicket);

//Landlord Routes
app.post('/verify_tenant/:tenant_email', FBAuthLL, verifyTenant);
app.post('/verify_worker/:worker_email', FBAuthLL, verifyWorker);
app.post('/suspend_tenant/:tenant_email', FBAuthLL, suspendTenant);
app.post('/suspend_worker/:worker_email', FBAuthLL, suspendWorker);
//app.get('/verified_users', FBAuthLL, getVerifiedUsers);
//app.get('/unverified_users', FBAuthLL, getUnverifiedUsers);
// app.delete('/delete_user', FBAuthLL, deleteUser);
//app.delete('/delete_ticket/:ticket_id', FBAuthLL, deleteTicket);
// app.post('/assign_ticket/:ticket_id', FBAuthLL, assignTicket);
// app.post('/unassign_ticket/:ticket_id',FBAuthLL, unassignTicket);


exports.api = functions.https.onRequest(app);
