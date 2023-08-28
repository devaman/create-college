const College = require('../models/college/college.js')
var vhost = require('vhost')
// module.exports = vhost('*.ismy.ml', async function handle(req, res, next) {
//     let college =  await College.findOne({name:req.vhost[0]})
//      if(college)
//      req.college = college;
//      else req.redirect = req.vhost[0];
//     next();
// })
module.exports = process.env.NODE_ENV === 'production' ?
    vhost('*.ismy.institute', async function handle(req, res, next) {
        let college = await College.findOne({ name: req.vhost[0] })
        if (college)
            req.college = college;
        else req.redirect = req.vhost[0];
        next();
    }) : 
    async function (req, res, next) {

        req.college = await College.findOne({ name: "nith" });
        next()
    }