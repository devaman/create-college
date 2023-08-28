const user = require('../models/users/user.js');
const request = require('request');
const Events = require('../models/events/events.js')
const Project = require('../models/projects/projects.js')
const College = require('../models/college/college.js')

const auth = require('../auth/auth');
const BlogEntry = require('../models/Blogs/Blog.js');
const config = require('../config/database.js');
exports.getAllCollege = async (req, res, next) => {
  try {
    let colleges = await College.find().select({ "name": 1, "fullName": 1 })
    res.json({ colleges })

  } catch (err) {
    res.status(400).json(err)
  }

}

exports.createCollegeRepos = async (req, res, next) => {

  var options = {
    method: 'POST',
    url: `https://api.github.com/orgs/${req.body.institute}/repos`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1521.3 Safari/537.36',

      'Content-Type': 'application/json',
      'Authorization': `token ${config.gitConfig.accessToken}`
    },
    body: JSON.stringify({
      name: req.body.name,
      description: req.body.description,
      auto_init: true,
      private: false,
      has_projects: true,
      homepage: req.body.homepage

    })

  };

  request(options, (err, response, body) => {
    const parsedData = JSON.parse(body);
    if (err)
      return res.json({ message: err })

    else
      return res.json({ body: parsedData });

  })





}

exports.getAllcollegeProjects = async (req, res, next) => {

  var perPage = 10
    , page = Math.max(0, req.query.index)
  College.findOne({ name: req.college.name }).populate({
    path: "projects", model: 'projects', select: { 'project.name': 1, 'college': 1, 'project.avatar_url': 1, 'project.url': 1, 'project.username': 1, 'project.languages': 1, 'project.open_issues': 1, 'project.forkCounts': 1, 'project.updated_at': 1 }, options: {
      limit: perPage,
      skip: page * perPage,
      sort: { date: -1 }
    }
  }).exec(function (err, doc) {
    if (err) { res.status(500).json(err); return; };
    res.status(200).json({ projects: doc.projects });
  });


}

exports.createCollege = async (req, res, next) => {


  let collegeName = req.body.collegeName;
  let collegeDetails = req.body.collegeDetails;
  let collegeFullname = req.body.collegeFullname;
  let logo = req.body.logo;
  let college = new College({
    name: collegeName,
    collegeDetails,
    fullName: collegeFullname,
    logo: logo,
    createdOn: Date.now(),
    ModifiedOn: Date.now()

  });
  college.save()

  res.json({ college })

}

exports.getCollegeBlogs = async (req, res, next) => {

  var perPage = 10
    , page = Math.max(0, req.query.index)
  College.findOne({ name: req.college.name }).populate({
    path: "blogEntries", model: 'blogs', select: { 'title': 1, 'author': 1, 'slug': 1 }, options: {
      limit: perPage,
      skip: page * perPage,
      sort: { ModifiedOn: -1 }
    }, populate: { path: 'author', model: 'user', select: { 'avtarUrl': 1, 'username': 1, 'college': 1 } }
  }).exec(function (err, doc) {
    if (err) { res.status(500).json(err); return; };
    BlogEntry.find({ category: "shared" }).select('title author slug category').populate({ path: 'author', model: 'user', select: { 'avtarUrl': 1, 'username': 1, 'college': 1 }}).exec((err, docu) => {
      if (err) { res.status(500).json(err); return; };
      let arr = [...docu,...doc.blogEntries] ;
      arr = arr.filter((v,i,a)=>a.findIndex(t=>(t._id.equals(v._id)))===i);
      res.status(200).json({ blogs: arr});
    })
  });


}