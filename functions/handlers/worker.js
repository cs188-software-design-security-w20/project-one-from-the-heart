const { admin, db} = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase')

//firebase.initializeApp(config)

exports.closeTicket = (req,res) => {

  let ticket_id = req.params.ticket_id
  //console.log(ticket_id)
  let closedTicket = { is_closed: true }

  db
  .doc(`/tickets/${req.params.ticket_id}`)
  .update(closedTicket)
  .then(() => {
    console.log(`closed ticket ${req.params.ticket_id} successfully`)
  })
  .catch(err => {
    console.error(err)
  })

  db
  .collection('/workers')
  .doc(req.worker.email)
  .update({
      finished_tickets: admin.firestore.FieldValue.arrayUnion(ticket_id),
      assigned_tickets: admin.firestore.FieldValue.arrayRemove(ticket_id)
    })
  .then(() => {
      console.log(`moved ticket ${req.params.ticket_id} to finished`)
      return res.status(200).json({general: 'closed ticket successfully'})
  })
  .catch(err => {
    console.error(err)
  })
}

exports.assignTicket = (req,res) => {

  let ticket_id = req.params.ticket_id
  //console.log(ticket_id)
  let assignTicket = { is_assigned: true }

  db
  .doc(`/tickets/${req.params.ticket_id}`)
  .update(assignTicket)
  .then(() => {
    console.log(`assigned ticket ${req.params.ticket_id} successfully`)
  })
  .catch(err => {
    console.error(err)
  })

  db
  .collection('/workers')
  .doc(req.worker.email)
  .update({
      assigned_tickets: admin.firestore.FieldValue.arrayUnion(ticket_id)
    })
  .then(() => {
      console.log(`send ticket ${req.params.ticket_id} to worker`)
      return res.status(200).json({general: 'assigned ticket successfully'})
  })
  .catch(err => {
    console.error(err)
  })

}

exports.unassignTicket = (req,res) => {

  let ticket_id = req.params.ticket_id
  //console.log(ticket_id)
  let unassignTicket = { is_assigned: false }

  db
  .doc(`/tickets/${req.params.ticket_id}`)
  .update(unassignTicket)
  .then(() => {
    console.log(`unassigned ticket ${req.params.ticket_id} successfully`)
  })
  .catch(err => {
    console.error(err)
  })

  db
  .collection('/workers')
  .doc(req.worker.email)
  .update({
      assigned_tickets: admin.firestore.FieldValue.arrayRemove(ticket_id)
    })
  .then(() => {
      console.log(`unassigned ticket ${req.params.ticket_id} to finished`)
      return res.status(200).json({general: 'unassigned ticket successfully'})
  })
  .catch(err => {
    console.error(err)
  })

}
