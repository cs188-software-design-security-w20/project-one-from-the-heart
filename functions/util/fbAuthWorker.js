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
        //template string may be unsafe
        .doc(req.worker.email)

      workerDoc
      .get()
      .then((doc) => {
        req.worker.assigned_ticket = doc.data().assigned_ticket;
        return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    })
  })
};
