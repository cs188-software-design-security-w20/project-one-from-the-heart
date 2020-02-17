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
      //if (req.worker.user_type !== "worker")
      // {
          //throw an error
      // } else {

    let workerDoc =
    db
    .collection('workers')
    .doc(req.worker.email)

    workerDoc
    .get()
    .then((doc) => {
        req.worker.email = doc.data().email
        req.worker.assigned_tickets = doc.data().assigned_tickets
        return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    })
  })
};
