const functions = require('firebase-functions');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { getAllTickets, postOneTicket } = require('./handlers/tickets');
const{signup, login} = require('./handlers/users');

// // https://firebase.google.com/docs/functions/write-firebase-functions

// Tickets routes
app.get('/tickets', getAllTickets);
app.post('/ticket', FBAuth, postOneTicket);

// Users Routes
app.post('/signup', signup);
app.post('/login', login);

// newly added but internal server error
/* const FBAuth = (req, res, next) => {
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startswith('Bearer ')){
    idToken = req.headers.authorization.split('Bearer ')[1];

  } else {
    console.error('No token found')
    return res.status(403).json({error: 'Unauthorized'});
  }
  
  admin.auth().verifyIdToken(idToken)
  .then(decodedToken=>{
    req.user = decodedToken;
    console.log(decodedToken);
    return db.collection('users')
    .where('userId','==',req.user.uid)
    .limit(1)
    .get();

  })
  .then(data=>{
    return next();
  })
  .catch(err =>{
    console.error('Error while verifying token',err);
    return res.status(403).json(err);
  })
} */

exports.api = functions.https.onRequest(app);