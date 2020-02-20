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
          priority: doc.data().priority,
          submit_time: doc.data().submit_time,
          special_insns: doc.data().special_insns,
          full_name: doc.data().full_name
        });
      });
        return res.json(tickets);
      })
      .catch(err => console.error(err));
  }

exports.postOneTicket = (req, res) => {
    const newTicket = {
      address: req.user.address,
      description: req.body.description,
      submit_time: new Date().toISOString(),
      full_name: req.user.full_name
    };

    //add ticket to tickets collection
    db
    .collection('/tickets')
    .add(newTicket)
    .then(doc => {
      //add ticket_id to user's requested_tickets array
      db
      .collection('/users')
      .doc(`${req.user.email}`)
      .update({
        requested_tickets: admin.firestore.FieldValue.arrayUnion(`${doc.id}`)
      });
      return res.json({message: 'Ticket created successfully'});
    })
    .catch( err => {
      res.status(500).json({error: 'something went wrong'});
      console.error(err);
    })
  };

exports.getWorkersTickets = (req, res) => {
      let tickets = []

      if(!req.worker.assigned_tickets)
      {
        return res.status(400).json({error: "This worker has no assigned tickets"})
      }
      else
      {
        for(let ticket_id in req.worker.assigned_tickets)
        {
          //console.log(req.user.requested_tickets)
          db
          .collection('/tickets')
          .doc(req.worker.assigned_tickets[ticket_id])
          .get()
          .then( doc => {
          //console.log(doc.data());
            tickets.push(doc.data());
            if(Number(ticket_id) === req.worker.assigned_tickets.length - 1)
            {
              return res.json(tickets);
            }
          })
          .catch( err => {
            console.error(err);
          })
        }
      }

  };

exports.getTenantTickets = (req, res) => {
      let tickets = []

      if(!req.user.requested_tickets)
      {
        return res.status(400).json({error: "This user has no requested tickets"})
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
            if(Number(ticket_id) === req.user.requested_tickets.length - 1)
            {
              return res.json(tickets);
            }
          })
          .catch( err => {
            console.error(err);
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
        res.json({ message: 'Ticket closed successfully' });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  };
