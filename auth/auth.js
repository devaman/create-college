module.exports = (req,res,next) =>{

    if(!req.user)
    {
        res.status(404).json({message:"Route not found"});
    }

    next();
}