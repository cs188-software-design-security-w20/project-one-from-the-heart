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
          tenant_name: doc.data().tenant_name
        });
      });
        return res.json(tickets);
      })
      .catch(err => console.error(err));
  }

  exports.postOneTicket = (req, res) => {
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
  };

  exports.getWorkersTickets = (req, res) => {
      db
      .collection('tickets')
            //warning template string may be insecure
      .doc(req.worker.assigned_ticket)
      .get()
      .then( doc => {
          let tickets = [];
          tickets.push({
            ticket_id: doc.id,
            address: doc.data().address,
            description: doc.data().description,
            priority: doc.data().priority,
            submit_time: doc.data().submit_time,
            special_insns: doc.data().special_insns,
            tenant_name: doc.data().tenant_name
              });
                return res.json(tickets);
            })
        .catch((err) => {
          console.error(err)
        })
  };

  exports.closeTicket = (req, res) => {
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
