const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let workerToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    workerToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
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
        if(doc.data().assigned_tickets)
          req.worker.assigned_tickets = doc.data().assigned_tickets;
        return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
  })
};
