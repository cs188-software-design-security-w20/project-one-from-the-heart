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
      return db
        //template string may be insecure
        .collection('users')
        .where('email', '==', req.user.email)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.user_id = data.docs[0].data().user_id;
      req.user.created_at = data.docs[0].data().created_at;
      req.user.tenant_name = data.docs[0].data().tenant_name;
      return next();
    })
    .catch((err) => {
      console.error('Error while verifying token ', err);
      return res.status(403).json(err);
    });
};
