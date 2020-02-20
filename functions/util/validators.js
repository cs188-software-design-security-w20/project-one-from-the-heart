const {db} = require('../util/admin');

const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) return true;
    else return false;
  };

  const isEmpty = (string) => {
    if (string.trim() === '') return true;
    else return false;
  };

  exports.validateSignupData = (data) => {
    let errors = {};
    //Email Errors
    if(isEmpty(data.email)) {
      errors.email = "Must not be empty"
    } else if(!isEmail(data.email))
    {
      errors.email = "Not a valid email"
    }

    //Password Errors
    if(isEmpty(data.password)) {
      errors.password = "Must not be empty"
    }
    if(data.password !== data.confirm_password){
      errors.password = "Passwords must match"
    }

    //Full Name Errors
    if(isEmpty(data.full_name)) {
      errors.full_name = "Must not be empty"
    }

    //Adress Errors
    if(isEmpty(data.address)) {
      errors.address = "Must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
  }

  exports.validateLoginData = (data) => {
    let errors = {}
    let verified = {}
    var verified_tenant = false;
    var verified_worker = false;
    var verified_ll = false;

    if(isEmpty(data.email)) errors.email = 'Must not be empty';
    if(isEmpty(data.password)) errors.password = 'Must not be empty';

    return db
    .doc(`/users/${data.email}`)
    .get()
    .then(doc => {
      //console.log(doc.data())
      if(doc.data().verified_tenant || doc.data().verified_ll || doc.data.verified_worker)
      {
        return {
            errors,
            verified: true,
            valid: Object.keys(errors).length === 0 ? true : false
        }
      }
      else
      {
        return {
            errors,
            verified: false,
            valid: Object.keys(errors).length === 0 ? true : false
        }
      }

    })
    .then(data => {
      return data;
    })
    .catch(err => {
      console.error(err)
    })


  }

exports.reduceUserSettings = (data) => {
    let userSettings = {
      full_name: '',
      address: '',
      password: ''
    }
    let changedSetting = ""

    if(data.change_name && !isEmpty(data.change_name))
    {
      userSettings.full_name = data.change_name;
      changedSetting = "full_name"
    }
    // if(data.change_email && !isEmpty(data.change_email) && isEmail(data.change_email))
    // {
    //   userSettings.email = data.update_email;
    //   changedSetting = "email"
    // }
    if(data.change_location && !isEmpty(data.change_location))
    {
      userSettings.address = data.change_location
      changedSetting = "address"
    }
    if(data.change_password && !isEmpty(data.change_password) && data.change_password === data.confirm_password)
    {
      userSettings.password = data.change_password;
      changedSetting = "password"
    }

    //console.log(usersettings.full_name);

    return {
      userSettings,
      changedSetting
    }
  }
