const user = require('../models/users/user.js');
const request = require('request');
const Events = require('../models/events/events.js')
const Project = require('../models/projects/projects.js')
const College = require('../models/college/college.js')
const config = require('../config/database.js');
const auth = require('../auth/auth');
const BlogEntry = require('../models/Blogs/Blog.js');
exports.logout   = async (req, res) => {
    req.session = null;
    res.redirect('/')
  }

exports.init = async (req, res) => {
     
    if (req.college) {
      const college = await College.findOne({ name: req.college.name });
      req.count = {
        blogs: college.blogEntries.length,
        projects: college.projects.length,
        events: college.event.length
      }

    } else
      req.count = {
        blogs: 0,
        projects: 0,
        events: 0
      }



    const actualPage = '/'
    const tab = req.query.tab || "projects";
    const queryParams = { college: req.college, user: req.user, tab: tab, count: req.count }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college, tab, count: req.count })
    } else
        res.locals.app.render(req, res, actualPage, queryParams)
  }

  exports.loadAdmin  =async (req, res) => {


    const actualPage = '/admin'
    const queryParams = { college: req.college, user: req.user }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college })
    } else
      res.locals.app.render(req, res, actualPage, queryParams)
  }

  exports.updateUserDetails =async (req, res, next) => {

    const username = req.user.username;
    user.findOne({ username: username }, function (err, user) {

      if (req.body.college)
        user.college = req.body.college;
      if (req.body.email)
        user.email = req.body.email;


      user.save();

      req.session.user = user;
      res.json({ done: true })
    })
    
    }

    exports.addAdmin = async (req, res, next) => {
  
      const username = req.body.username;
    
    
      const userDetails = await user.findOne({ username: username });
    
    
      if (!userDetails) {
        return res.status(404).json({ message: false });
    
      }
    
      else {
    
        userDetails.isAdmin = 1;
        userDetails.save();
    
        return res.status(200).json({ message: true });
      }
    
    
    
    
    }

   exports.getRegisteredUsersById = async(req,res,next)=>{
  
      const eventId = req.params.id;
      const eventData = await Events.findOne({_id:eventId}).populate({path:'registeredUsers',model:'user',select:'username email college gitUrl avtarUrl'});
      
      if(!eventData)
      {
        return res.status(400).json({message:false,data:[]});  
      }
      else if(eventData.organizer.equals(req.user._id))
      {
        return res.status(201).json({message:true,data:eventData.registeredUsers});
       
      }
      return res.status(400).json({message:false,data:[]});
    
    
    
    }
   exports.getWithPid =  async (req, res) => {

      let id = req.params.pid;
      const actualPage = '/[pid].js';
      let profile = await user.findOne({username:id}).populate([
        {path:'blogEntries',model:'blogs'},
        {path:'projects',model:'projects'}, 
        {path:'events',model:'events',
          populate:
          {path:"organizer",model:'user'}
        }
      ]);
      
      const queryParams = { college: req.college, user: req.user,profile }
      req.profile = profile;
      if (req.accepts(['html', 'json']) === 'json') {
        res.json({ user: req.user,profile, college: req.college })
      } else
        res.locals.app.render(req, res, actualPage, queryParams)
    }