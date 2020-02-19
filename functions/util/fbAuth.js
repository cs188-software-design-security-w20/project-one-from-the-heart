const { admin, db } = require('./admin');

module.exports = (req, res, next) => {
  let idToken;
  //let user;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({ error: 'Unauthorized' });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;

      console.log(req.user)
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
      //req.user.email = data.docs[0].data().email;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    });
};
