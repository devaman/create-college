var express = require('express');
var router = express.Router();
var passport = require('passport');
const passportInit = require('../config/passport')
var getSubdomain = require('../middleware/subdomain')
const auth = require('../auth/auth');
const authHandler = require('../contorller/authHandler')
const projectHandler = require('../contorller/projectHandler')
const blogHandler = require('../contorller/blogHandler');
const eventHandler = require('../contorller/eventHandler')
const collegeHandler = require('../contorller/collegeHandler');
const config = require('../config/database.js');
const { default: Axios } = require('axios');

/* GET api listing. */
module.exports = (app) => {

  //router.post('/signup', authController.signup);
  router.get('/login', passport.authenticate('github', { failureRedirect: '/login' }));
  //router.get('/verifyemail', authController.verifiEmail); 
  // router.get('/resendverification',authController.resendVerification);

  // Authenticated Routes

  router.get('/auth', getSubdomain, function (req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      let redirecturl = req.query.redirect || '/';
      if (req.college) {
        passport.authenticate(
          'github',
          {
            callbackURL: `https://${req.college.name}.ismy.institute/auth?redirect=${redirecturl}`,
            failureRedirect: `https://${req.college.name}.ismy.institute`
          }
        )(req, res, next)
      } else
        passport.authenticate(
          'github',
          {
            callbackURL: `https://${req.redirect}.ismy.institute/auth?redirect=${redirecturl}`,
            failureRedirect: `https://${req.redirect}.ismy.institute`
          })(req, res, next)
    } else {

      let redirecturl = req.query.redirect || '/';

      passport.authenticate(
        'github',
        {
          callbackURL: `${config.ROOT_URL}/auth?redirect=${redirecturl}`,
          failureRedirect: `${config.ROOT_URL}`
        }
      )(req, res, next)
    }
  }, (req, res, next) => {


    let redirecturl = req.query.redirect || '/';
    res.redirect(redirecturl)
  })



  router.get('/logout', authHandler.logout);
  /* Render Pages */

  // Home
  router.get('/', getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, authHandler.init)

  // Add Project
  router.get('/addProject', auth, getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, projectHandler.addProject);


  // delete Project
  router.post('/deleteProject', auth, getSubdomain, projectHandler.deleteProject);
  // Create Page
  router.get('/createPage0', auth, getSubdomain, (req, res) => {


    const actualPage = '/createPage'
    const queryParams = { college: req.college, user: req.user }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college })
    } else
      app.render(req, res, actualPage, queryParams)
  })

  router.get('/writeBlog', auth, getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, blogHandler.writeBlog)
  // Create Event

  router.get('/createEvent', auth, getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, eventHandler.createEvent)

  // Admin

  router.get('/admin', getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, authHandler.loadAdmin);


  // Blog Details
  router.get('/blog/:bid', getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, blogHandler.getBlog)


  // Event Details
  router.get('/event/:eid', getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, eventHandler.getEvent)







  /*  API */
  // Get all college page
  router.post('/getallcollegepages', collegeHandler.getAllCollege)
  // Update Details
  router.post('/updateDetails', auth, authHandler.updateUserDetails)




  // Get all user public github projects
  router.get('/getAllUserProjects', auth, projectHandler.getAllUserProjects);


  // Create a college repo

  router.post('/createCollegeRepos', function (req, res, next) {
    res.locals.app = app;
    next();
  }, collegeHandler.createCollegeRepos)



  // Get Events
  router.get('/getEvents', eventHandler.getEvents);

  /* Projects */
  router.post('/addProjecttoCollege', auth, getSubdomain, projectHandler.addProjecttoCollege)

  // Get all college projects
  router.get('/getAllcollegeProjects', getSubdomain, collegeHandler.getAllcollegeProjects)


  router.post('/createCollege', auth, getSubdomain, collegeHandler.createCollege)

  /*List*/


  router.post('/saveBlog', auth, getSubdomain, blogHandler.saveBlog);


  router.get('/getCollegeBlogs', getSubdomain, collegeHandler.getCollegeBlogs)


  router.post('/deleteBlog', auth, getSubdomain, blogHandler.deleteBlog)






  //////////////////////////////////////////////// Events routes ////////////////////////////////////////////

  router.post('/addEvent', auth, getSubdomain, eventHandler.addEvent);


  router.get("/getAllEvents", getSubdomain, eventHandler.getAllEvents)

  router.post('/addAdmin', auth, getSubdomain, authHandler.addAdmin);


  router.post('/deleteEvent', auth, getSubdomain, eventHandler.deleteEvent)

  router.post('/registerForEvent', auth, getSubdomain, eventHandler.registerForEvent);

  // ///////////////////////////// Modify Blog///////////////////////
  router.get('/getblog/:id', auth, getSubdomain, blogHandler.getBlogById)



  router.post('/modifyBlog/:id', auth, getSubdomain, blogHandler.modifyBlog)
  ////////////////////////Event modification/////////////////////////////////////////////////

  router.get('/getEvent/:id', auth, getSubdomain, eventHandler.getEventById)

  router.post("/modifyEvent/:id", auth, eventHandler.modifyEvent)

  ///////////////////getRegisteredUsers//////////////////////////////////

  router.get('/getRegisteredUsers/:id', auth, getSubdomain, authHandler.getRegisteredUsersById)
  // Add Project

  router.get('/:pid', getSubdomain, function (req, res, next) {
    res.locals.app = app;
    next();
  }, authHandler.getWithPid);
  // Twitter
  router.get('/api/twitter', (req, res) => {
    Axios.get('https://publish.twitter.com/oembed?url=' + req.query.url).then(result => {
      console.log(result.data);
      let text = result.data.html
      var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      while (SCRIPT_REGEX.test(text)) {
        text = text.replace(SCRIPT_REGEX, "");
      }
      // text = text+`<script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`

      res.send(text)
    }).catch(err => {
      res.status(404).json({ message: "Not Found" })
    })
  })


  return router;
}
