const { admin, db } = require('./admin');

exports.FBAuth = (req, res, next) => {
  let idToken;
  //let user;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(405).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;

      //console.log(req.user)
       return db
        .collection('users')
        .where('email', '==', req.user.email)
        .limit(1)
        .get()
    })
    .then((data) => {
      //console.log(data);
      req.user.user_id = data.docs[0].data().user_id;
      if(data.docs[0].data().requested_tickets)
        req.user.requested_tickets = data.docs[0].data().requested_tickets;
      req.user.email = data.docs[0].data().email;
      req.user.full_name = data.docs[0].data().full_name;
      req.user.address = data.docs[0].data().address;
      req.user.verified_tenant = data.docs[0].data().verified_tenant;
      req.user.verified_worker = data.docs[0].data().verified_worker;
      req.user.verified_ll = data.docs[0].data().verified_ll;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(500).json({error: 'Server error while verifying token'});
    });
};

exports.FBAuthWorker = (req, res, next) => {
  let workerToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    workerToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(405).json({ error: 'Unauthorized' });
  }
  admin
    .auth()
    .verifyIdToken(workerToken)
    .then((decodedToken) => {
      req.worker = decodedToken;

      return db
      .collection('workers')
      .doc(req.worker.email)
      .get()
    })
    .then((doc) => {
        req.worker.email = doc.data().email;
        req.worker.user_id = doc.data().user_id;
        if(doc.data().assigned_tickets)
          req.worker.assigned_tickets = doc.data().assigned_tickets;
        req.worker.full_name = doc.data().full_name;
        return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(500).json({error: 'Server error while verifying token'});
  })
};

exports.FBAuthLL = (req, res, next) => {
  let landlordToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    landlordToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(405).json({ error: 'Unauthorized' });
  }
  admin
    .auth()
    .verifyIdToken(landlordToken)
    .then((decodedToken) => {
      req.landlord = decodedToken;

    return db
    .collection('landlord')
    .doc(req.landlord.email)
    .get()
    })
    .then((doc) => {
        req.landlord.email = doc.data().email;
        req.landlord.full_name = doc.data().full_name;
        return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(500).json({error: 'Server error while verifying token'});
  })
};
