const { admin, db} = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase')

//firebase.initializeApp(config)

exports.verifyWorker = (req,res) => {
  //console.log(ticket_id)
  db
  .doc(`/users/${req.params.worker_email}`)
  .update({verified_worker: true})

  db
  .doc(`/users/${req.params.worker_email}`)
  .get()
  .then( data => {
    let worker = {
      full_name: data.data().full_name,
      address: data.data().address,
      email: data.data().email,
      verified_worker: true,
    }
    db
    .doc(`/workers/${req.params.worker_email}`)
    .set(worker)
    .then( () => {
      return res.status(200).json({general: 'Worker verified'})
    })
  })
  .catch(err => {
    console.error(err)
    return res.status(400).json({general: `Unable to verify ${req.params.worker_email}`})
  })

}
