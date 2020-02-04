const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();
//const config = require('../util/config');
//const app = express();
const firebaseConfig = {
    apiKey: "AIzaSyAE9JGFsbBGJ6NetC2Y_DNS0DV46EThATw",
    authDomain: "maintenance-genie.firebaseapp.com",
    databaseURL: "https://maintenance-genie.firebaseio.com",
    projectId: "maintenance-genie",
    storageBucket: "maintenance-genie.appspot.com",
    messagingSenderId: "330034789814",
    appId: "1:330034789814:web:5e9b1576622cd8512c9517",
    measurementId: "G-Q4KBFMW4ZR"
  };
  // Initialize Firebase
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

app.get('/tickets', (req, res) => {
  db
  .collection('tickets')
  .orderBy('submit_time', 'desc')
  .get()
    .then( data => {
      let tickets = [];
      data.forEach((doc) => {
        tickets.push({
        ticketId: doc.id,
        address: doc.data().address,
        description: doc.data().description,
        priority: doc.data().priority,
        submit_time: doc.data().submit_time,
        special_insns: doc.data().special_insns,
        tenant_name: doc.data().tenant_name
      });
    });
      return res.json(tickets);
    })
    .catch(err => console.error(err));
});

app.post('/ticket', (req, res) => {
  const newTicket = {
    address: req.body.address,
    description: req.body.description,
    priority: 1,
    submit_time: new Date().toISOString(),
    special_insns: req.body.special_insns,
    tenant_name: req.body.tenant_name
  };

  db
  .collection('/tickets')
  .add(newTicket)
  .then(doc => {
    return res.json({message: `document ${doc.id} created successfully`});
  })
  .catch( err => {
    res.status(500).json({error: 'something went wrong'});
    console.error(err);
  })
});

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
};

app.post('/signup', (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
    };
    //TODO: validate data
    let errors = {};
    if(isEmpty(newUser.email)) {
      errors.email = "Must not be empty"
    } else if(!isEmail(newUser.email))
    {
      errors.email = "Not a valid email"
    }

    if(isEmpty(newUser.password)) {
      errors.password = "Must not be empty"
    }
    if(newUser.password !== newUser.confirm_password){
      errors.password = "Passwords must match"
    }

    if(Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    let token, userId;
    db.doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
        if (doc.exists){
            return res.status(400).json({handle: 'this email is already taken'});
        }else{
         return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
    })
    //because we have an then, so just use this to do a return
    .then((data) => {
        userId = data.user.uid
        return data.user.getIdToken();
    })
    .then((idToken) => {
        token = idToken;
        const userCredentials = {
          email: newUser.email,
          created_at: new Date().toISOString(),
          userId: userId
        }
        //maybe unsafe to use string eval here
        return db.doc(`/users/${newUser.email}`).set(userCredentials);

    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err)=>{
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'email is already in use'})
        }
        return res.status(500).json({error: err.code});
    });
});

exports.api = functions.https.onRequest(app);

exports.reduceUserDetails = (data) => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    // https://website.com
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
