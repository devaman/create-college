var User = require('../models/users/user');
var sendVerificationEmail = require('../helpers/email').sendVerificationEmail;
const tokenForUser = require('../helpers/token').tokenForUser;
/**
 * Reset password
 */
exports.resetPassword = (req, res, next) => {
    const email = req.body.email;
  
    User.findOne({ email }, (err, user) => {
      if (err) { return next(err); }
  
      if (!user) {
        return res.status(422).send({ error: "email doesn't exists" });
      }
  
      const token = tokenForUser(user);
  
      const afterOneHour = new Date();
      afterOneHour.setHours(afterOneHour.getHours() + 1);
  
      User.findByIdAndUpdate(user.id, { resetPassword: { token, used: 0, expires: afterOneHour } }, (err) => {
        if (err) { return next(err); }
  
        sendResetPassword(email, user.firstname, token);
  
        res.json({ success: true });
      });
    });
  };
  
  /**
   * Verify reset password
   */
  exports.verifyResetPassword = (req, res, next) => {
    const { email, token } = req.body;
  
    User.findOne({ email }, (err, user) => {
      if (err) { return next(err); }
  
      if (!user) {
        return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
      }
  
      if (user.resetPassword.used) {
        return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
      }
  
      if (new Date() > user.resetPassword.expires) {
        return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
      }
  
      if (token !== user.resetPassword.token) {
        return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
      }
  
      res.json({ success: true });
    });
  };
  
  /**
   * Reset password, new password
   */
  exports.resetPasswordNew = (req, res, next) => {
    const { email, newpassword, token } = req.body;
  
    User.findOne({ email }, (err, user) => {
      if (!user) {
        return res.status(422).send({ error: { message: "email doesn't exists", resend: false } });
      }
  
      if (user.resetPassword.used) {
        return res.status(422).send({ error: { message: "link already used, please request reset password again", resend: true } });
      }
  
      if (new Date() > user.resetPassword.expires) {
        return res.status(422).send({ error: { message: "link already expired, please request reset password again", resend: true } });
      }
  
      if (token !== user.resetPassword.token) {
        return res.status(422).send({ error: { message: "something has gone wrong, please request reset password again", resend: true } });
      }
  
      bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
  
        bcrypt.hash(newpassword, salt, null, (err, hash) => {
          if (err) { return next(err); }
  
          User.findByIdAndUpdate(user.id, { password: hash, resetPassword: {} }, (err) => {
            if (err) { return next(err); }
  
            const { firstname, lastname, email } = user;
  
            res.json({ firstname, lastname, email, token: tokenForUser(user) });
          });
        });
      });
    });
  };
  