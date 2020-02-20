const {db} = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase')

firebase.initializeApp(config)

const {validateSignupData, validateLoginData, reduceUserSettings} = require('../util/validators');

exports.signup = (req,res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
        full_name: req.body.full_name,
        address: req.body.address
    };

    const{ valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);

    let token, userId;
    db.doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
        if (doc.exists){
            return res.status(400).json({email: 'this email is already taken'});
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
          user_id: userId,
          full_name: newUser.full_name,
          address: newUser.address,
          verified_tenant: false,
          verified_worker: false,
          verified_ll: false
        }
        //maybe unsafe to use string eval here
        return db.doc(`/users/${newUser.email}`).set(userCredentials);

    })
    .then(() => {
      res.set('Access-Control-Allow-Origin', '*');
      return res.status(201).json({ token });
    })
    .catch((err)=>{
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(400).json({ email: 'email is already in use'})
        }
        return res.status(500).json({general: 'Something went wrong, please try again'});
    });
}

exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

const{ valid, verified, errors } = validateLoginData(user);

if(!valid) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email,user.password)
  .then(data=>{
    return data.user.getIdToken();
  })
  .then(token=>{
    return res.json({token, verified});
  })
  .catch(err=>{
    console.error(err);
      return res
          .status(403)
          .json({general: 'Wrong credentials, please try again'});
  });
}

exports.editAccount = (req, res) => {

  const { userSettings, changedSetting, previous_email } = reduceUserSettings(req.body);
  //console.log(userSettings)

  let update_obj = { [changedSetting] : userSettings[changedSetting] }
  db
  .doc(`/users/${previous_email}`)
  .update(update_obj)
  .then(() => {
    return res.json({message: `Updated ${changedSetting} successfully` })
  })
  .catch(err => {
    console.error(err)
    return res.status(400).json({general: `Please enter valid ${changedSetting}` })
  })
}

exports.viewProfile = (req, res) => {
  db
  .doc(`/users/${req.params.email}`)
  .get()
  .then((doc) => {
    return res.json(doc.data())
  })
  .catch(err => {
    console.error(err)
  })
}
