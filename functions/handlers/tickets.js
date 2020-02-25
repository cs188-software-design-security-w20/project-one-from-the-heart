const {admin, db} = require('../util/admin');

exports.getAllTickets = (req, res) => {
    db
    .collection('tickets')
    .orderBy('submit_time', 'desc')
    .get()
      .then( data => {
        let tickets = [];
        data.forEach((doc) => {
          tickets.push({
          ticket_id: doc.id,
          address: doc.data().address,
          description: doc.data().description,
          submit_time: doc.data().submit_time,
          full_name: doc.data().full_name,
          is_closed: doc.data().is_closed,
          is_assigned: doc.data().is_assigned
        });
      });
        return res.status(200).json(tickets);
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: 'Invalid database query'})
      });
  }

exports.postOneTicket = (req, res) => {
    const newTicket = {
      address: req.user.address,
      description: req.body.description,
      submit_time: new Date().toISOString(),
      full_name: req.user.full_name,
      is_assigned: false,
      is_closed: false,
      ticket_id: ''
    };

    //add ticket to tickets collection
    db
    .collection('/tickets')
    .add(newTicket)
    .then(doc => {
      //add ticket_id to user's requested_tickets array
      db
      .collection('/tickets')
      .doc(`${doc.id}`)
      .update({
        ticket_id : doc.id
      })
      db
      .collection('/users')
      .doc(`${req.user.email}`)
      .update({
        requested_tickets: admin.firestore.FieldValue.arrayUnion(`${doc.id}`)
      });
      return res.status(200).json({message: 'Ticket created successfully'});
    })
    .catch( err => {
      res.status(400).json({error: 'Invalid input'});
      console.error(err);
    })
  };

exports.getAssignedTickets = (req, res) => {
      let tickets = []

      if(!req.worker.assigned_tickets)
      {
        return res.status(200).json({general: "This worker has no assigned tickets"})
      }
      else
      {
        //console.log(req.worker.assigned_tickets)
        const len = req.worker.assigned_tickets.length;

        for(let ticket_id in req.worker.assigned_tickets)
        {
          db
          .collection('/tickets')
          .doc(req.worker.assigned_tickets[ticket_id])
          .get()
          .then( doc => {
            //console.log(doc.data());
            var data = doc.data();
            tickets.push(data);
            if(tickets.length === len)
            {
              return res.status(200).json(tickets);
            }
          })
          .catch( err => {
            console.error(err);
            return res.status(500).json({error: 'Invalid database query'})
          })
        }
      }
  };

  exports.getUnnassignedTickets = (req, res) => {
    db
    .collection('tickets')
    .orderBy('submit_time', 'desc')
    .where('is_assigned', '==', false)
    .get()
      .then( data => {
        let tickets = [];
        data.forEach((doc) => {
          tickets.push(doc.data());
        })
        if(tickets)
        {
         return res.status(200).json(tickets);
        }
        else
        {
          return res.status(200).json({general: 'No unassigned tickets to display'})
        }
      })
      .catch(err =>{
        console.error(err)
        return res.status(500).json({error: 'Could not fetch unnasigned tickets'})
      });
};

exports.getTenantTickets = (req, res) => {
      let tickets = []

      if(!req.user.requested_tickets)
      {
        return res.status(200).json({general: "This user has no requested tickets"})
      }
      else
      {
        for(let ticket_id in req.user.requested_tickets)
        {
          //console.log(req.user.requested_tickets)
          db
          .collection('/tickets')
          .doc(req.user.requested_tickets[ticket_id])
          .get()
          .then( doc => {
            //console.log(doc.data());
            tickets.push(doc.data());
            if(tickets.length === req.user.requested_tickets.length)
            {
              return res.status(200).json(tickets);
            }
          })
          .catch( err => {
            console.error(err);
            return res.status(500).json({error: "Could not fetch tenant tickets"});
          })
        }
      }

  };

exports.deleteTicket = (req, res) => {
    const document = db.doc(`/tickets/${req.params.ticket_id}`);
    document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ error: 'Ticket not found' });
        }
        else {
          return document.delete();
        }
      })
      .then(() => {
        return res.status(200).json({general: `Ticket ${req.params.ticket_id} deleted successfully`})
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: 'Server error. Ticket could not be deleted' });
      });
  };
