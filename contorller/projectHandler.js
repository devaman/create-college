const user = require('../models/users/user.js');
const request = require('request');
const Events = require('../models/events/events.js')
const Project = require('../models/projects/projects.js')
const College = require('../models/college/college.js')
const config = require('../config/database.js');
const auth = require('../auth/auth');
const BlogEntry = require('../models/Blogs/Blog.js');
 
exports.addProject = (req, res) => {


    const actualPage = '/addProject'
    const queryParams = { college: req.college, user: req.user }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college })
    } else
      res.locals.app.render(req, res, actualPage, queryParams)
  }

  exports.deleteProject  = async (req, res, next) => {

    const projectDetails = await Project.findOne({ _id: req.body._id }).populate({ path: 'user', model: 'user' });

    if (!projectDetails) {
      return res.status(302).json({ message: "Not found" });
    }


    const userDetails = await user.findOne({ userId: projectDetails.user.userId });


    const collegeDetails = await College.findOne({ name: userDetails.college });


    collegeDetails.projects.remove(req.body._id);

    userDetails.projects.remove(req.body._id);

    collegeDetails.save();

    userDetails.save();

    projectDetails.remove();


    return res.status(201).json({ message: "true" });

  }

  exports.getAllUserProjects =  async (req, res, next) => {

    var options = {
      url: `https://api.github.com/users/${req.user.username}/repos`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',

        'Content-Type': 'application/json'

      },

    };



    request(options, (err, response, body) => {
      if (err)
        return res.json({ error: err });


      var projectDetails = [];


      const avtar = JSON.parse(response.body)

      avtar.forEach(val => {
        projectDetails.push({
          id: val.id,
          url: val.html_url,
          name: val.name,
          size: val.size,
          forkCounts: val.forks,
          click_count: val.watchers,
          project_url: val.url,
          createdAt: val.created_at,
          pushed_at: val.pushed_at,
          languages: val.language,
          updated_at: val.updated_at,
          open_issues: val.open_issues,
          avatar_url: val.owner.avatar_url,
          username: val.owner.login

        });

      })
      return res.json({ projectDetails: projectDetails });

    })
  }

  exports.addProjecttoCollege = async (req, res, next) => {

    const userDetails = await user.findOne({ userId: req.user.userId });
    const collegeDetails = await College.findOne({ name: req.college.name });


    let projects = req.body.projects.map(d => {


      return ({ user: req.user._id, college: req.user.college, project: d, date: Date.now() })
    });

    userDetails.save();
    collegeDetails.save();

    try {
      const allProjects = await Project.create(projects);

      for (var i = 0; i < allProjects.length; i++) {

        userDetails.projects.push(allProjects[i]._id);
        collegeDetails.projects.push(allProjects[i]._id);
      }

      userDetails.save();

      collegeDetails.save();

      res.json({ success: true });

    }
    catch (err) {
      res.json({ success: false, error: err.message })
    }



  }