const User = require('../models/users/user')
module.exports = async(req,res,next)=>{
    let user = await User.findOne({id:req.user.id});
    if((req.college.name ===user.college && user.isAdmin===1)){
        next();

    }else
    res.status(404).json("Not Authorized")
}