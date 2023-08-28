var jwt = require('jsonwebtoken');
var dbConfig = require('../config/database').dbConfig;

exports.tokenForUser = (user) => {

    return jwt.sign({id:user.id} , dbConfig.secret, { expiresIn: '365d' }).toString();
}