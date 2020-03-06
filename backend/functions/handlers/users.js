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
            return res.status(402).json({error: 'this email is already taken'});
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
        return db.doc(`/users/${newUser.email}`).set(userCredentials);

    })
    .then(() => {
      res.set('Access-Control-Allow-Origin', '*');
      return res.status(200).json({general: 'Successful signup. Please login with the same credentials'});
    })
    .catch((err)=>{
        console.error(err);
        if (err.code === 'auth/email-already-in-use') {
          return res.status(402).json({ error: 'email is already in use'})
        }
        return res.status(500).json({error: 'Internal server error. Please try again'});
    });
}

exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };

//const{ valid, verified, errors }
validateLoginData(user)
.then(data => {
  const {valid, verified, errors} = data
  if(!valid) return res.status(405).json(errors);
  //console.log()
  if(!verified)
  {
    let errors = { error: "Not verified by landlord" }
    return res.status(405).json(errors)
  }
})
.catch(err => {
  console.error(err)
  let errors = { error: "Something went wrong during validation" }
  return res.status(405).json(errors)
})


firebase.auth().signInWithEmailAndPassword(user.email,user.password)
  .then(data=>{
    return data.user.getIdToken();
  })
  .then(token=>{
    db.doc(`users/${user.email}`).get()
    .then(data => {
      let user_type = ''
      if( data.data().verified_tenant)
      {
          user_type = "tenant"
      }
      else if( data.data().verified_worker)
      {
          user_type = "worker"
      }
      else if(data.data().verified_ll)
      {
          user_type = "landlord"
      }
      if(user_type != ''){
       return res.status(200).json({user_type, token});
      }
      else {
       return res.status(405).json({error: 'Invalid login'})
      }
    })
    .catch(err => {
      return res.status(405).json({error: 'Invalid login'});
    })
  })
  .catch(err=>{
    console.error(err)
    let errors = {
      error: 'Invalid credentials'
    }
      return res.status(405).json(errors);
  });
}

exports.editAccount = (req, res) => {

  const { userSettings, changedSetting } = reduceUserSettings(req.body);
  //console.log(userSettings)
  if(req.user.verified_worker)
  {
    db
    .doc(`/workers/${req.user.email}`)
    .delete()
    .catch(err => {
      console.log(error);
      return res.status(500).json({error: 'Unable to delete worker from database'})
    })
  }
  //console.log(userSettings[changedSetting])
  if(changedSetting == "password")
  {
    var user = firebase.auth().currentUser;
    //console.log(user)
    user.updatePassword(userSettings[changedSetting])
    .then(function() {
      return res.status(200).json({general: "Successfully updated password"})
    }).catch(err => {
      console.error(err)
      return res.status(500).json({error: 'Unable to change password'})
    });
  }
  else
  {

    let update_obj = { [changedSetting] : userSettings[changedSetting],
                        verified_worker: false}
    db
    .doc(`/users/${req.user.email}`)
    .update(update_obj)
    .then(() => {
      return res.status(200).json({message: `Updated ${changedSetting} successfully` })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: `Unable to update ${changedSetting}` })
    })
  }
}

exports.viewProfile = (req, res) => {
  db
  .doc(`users/${req.user.email}`)
  .get()
    .then( data => {
        let profile = {
        address: data.data().address,
        email: data.data().email,
        full_name: data.data().full_name
      }
        return res.status(200).json(profile);
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: `Cannot display profile for ${req.user.email}`})
      });
}

exports.deleteAccount = (req, res) => {

      // Get a reference to the storage service
      accountRef = db.collection('users').doc(req.user.email)

      // Delete the file
      accountRef.delete()
      .then(() => {

          firebase.auth().signInWithEmailAndPassword(req.user.email,req.body.password)
          .then(data=>{
            return data.user.getIdToken();
          })
          .then(token=>{
            return res.status(200).json({general: "Successfully deleted account"})
          })
          .catch(err => {
          console.error(err)
          return res.status(405).json({ error: 'Incorrect Password' });
        })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'User not found in database' });
      })

}
