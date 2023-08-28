var user = require('../models/users/user');
const path =require('path');
const bcrypt = require('bcryptjs')
const tokenForUser = require('../helpers/token').tokenForUser;
const request   = require('request');
var sendVerificationEmail = require('../helpers/email').sendVerificationEmail;
exports.signup = async (req, res, next) => {   //sending the request to github to get all the details of employee

    const username = req.body.username;

   const password  =req.body.password;

   const email  =req.body.email;

   console.log(req.body);

var options = {
  url: `https://api.github.com/users/${username}`,
  headers: {
     'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',

    'Content-Type': 'application/json'
  },

};

   request(options,async(err,result,body)=>{
     const Message  = JSON.parse(body);
       
       if(Message.message == "Not Found")
          return res.status(404).json({message:Message.message});
 else
     {
        const hashed = await bcrypt.hash(password,12);
         const userData = JSON.parse(body);
         const currentUser = await user.findOne({username:req.body.username});

         if(!currentUser)
         {

            const newUser  = new user({
                  username:userData.login,
                  password:hashed,
                  email:email,
                  reposUrl:userData.repos_url,
                  gitUrl:userData.html_url,
                  followers:userData.followers,
                  following:userData.following


            })

            await newUser.save();

            return res.status(201).json({message:"Successully Registered"});

         }

     }
             

   })
  
}


// exports.login = async (req, res, next) => {
//    // will store the user now pass the cookie to the front end 
//       res.redirect("/",{

//         user:req.user
//       })

//     const username = req.body.username;

//   const password  =req.body.password;

//   const currentUser  =await user.findOne({username:username});


//   if(!currentUser)
//   {
//     return res.status(404).json({message:"Unauthorized user"});
//   }

//   const result = await bcrypt.compare(req.body.password,currentUser.password);


//   if(!result)
//   {
//     return res.status(404).json({message:"Unauthorized user"});

//   }

// // will create a session token 
//   return res.status(201).json({message:"successfully logged in"});
    
//c}
/**
 * Resend verification code
 */

// Verify Mail
// exports.verifiEmail = (req, res, next) => {
//     const { email, token } = req.query;
//     console.log(email, token);


//     User.findOne({ email }, (err, user) => {
//         if (err) { return next(err); }

//         if (!user) {
//             return res.status(422).send({ error: "User doesnt exists" });
//         }

//         if (user.auth.used) {
//             return res.status(422).send({ error: "link already used" });
//         }

//         if (new Date() > user.auth.expires) {
//             return res.status(422).send({ error: "link already expired" });
//         }

//         if (token !== user.auth.token) {
//             return res.status(422).send({ error: "something has gone wrong, please sign up again" });
//         }
//         User.findByIdAndUpdate(user.id, { auth: { used: true } }, (err) => {
//             if (err) { return next(err); }

//             const { email, firstname, lastname } = user;

//         res.sendFile(path.resolve('views/account.html'));
//         });
//     });
// };

