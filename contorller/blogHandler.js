const user = require('../models/users/user.js');
const College = require('../models/college/college.js')
const slugify = require('slugify')
const BlogEntry = require('../models/Blogs/Blog.js');
exports.writeBlog =  async(req, res) => {


    const actualPage = '/writeBlog';
    const blogId = req.query.blogId;
    req.blogId = blogId;
    const queryParams = { college: req.college, user: req.user, blogId }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college })
    } else
      res.locals.app.render(req, res, actualPage, queryParams)
  }
  
  exports.getBlog =  async (req, res) => {

    let slug = req.params.bid;
    const actualPage = '/blog/[bid].js'
    let blog = await BlogEntry.findOne({slug}).populate({ path: 'author', model: 'user', select: 'username avtarUrl' });
    req.blog = blog;
    const queryParams = { college: req.college, user: req.user, blog: blog }
    if (req.accepts(['html', 'json']) === 'json') {
      res.json({ user: req.user, college: req.college, blog: blog })
    } else
      res.locals.app.render(req, res, actualPage, queryParams)
  }

  exports.saveBlog = async (req, res, next) => {

    let title = req.body.title;
    let description = req.body.body;
  
  
    let college = req.user.college;
    const college_id = await College.findOne({ name: college });
  
    const newBlogEntry = new BlogEntry({
      slug:slugify(`${title}-${Math.random().toString(36).slice(8)}`,{lower:true}),
      title: title,
      body: description,
      author: req.user._id,
      college: college_id._id,
      createdOn: Date.now(),
      ModifiedOn: Date.now()
    });
  
    newBlogEntry.save();
    const userFound = await user.findOne({ userId: req.user.userId });
  
    user.findOne({ userId: req.user.userId }, async function (err, doc) {
      doc.blogEntries.push(newBlogEntry._id);
      doc.save();
  
      const college_id = await College.findOne({ name: req.user.college });
  
      college_id.blogEntries.push(newBlogEntry._id);
      college_id.save();
  
  
      return res.json({ message: true });
    });
  
  
  }

  exports.deleteBlog = async (req, res, next) => {
  
    const blogDetails = await BlogEntry.findOne({ _id: req.body._id }).populate({ path: 'author', model: 'user' });
  
    if (!blogDetails) {
      return res.status(302).json({ message: "Not found" });
    }
  
  
    const userDetails = await user.findOne({ userId: blogDetails.author.userId });
  
    const collegeDetails = await College.findOne({ name: userDetails.college });
  
    collegeDetails.blogEntries.remove(req.body._id);
  
    userDetails.blogEntries.remove(req.body._id);
  
    collegeDetails.save();
  
    userDetails.save();
  
    blogDetails.remove();
  
  
    return res.status(201).json({ message: "true" });
  
  }

  exports.getBlogById  = async (req, res) => {
    const blogId = req.params.id;
  
    blog = await BlogEntry.findById(blogId)
  
    res.json({ blog })
  }

  exports.modifyBlog =async (req, res, next) => {
  
    const title = req.body.title;
    const body = req.body.body;
    const blogId = req.params.id;
  
    const blogs = req.user.blogEntries;
    var flag = 0;
  
  
  
    if (blogs.find(element => element == blogId) == undefined) {
  
      return res.status(400).json({ message: false });
    }
    else {
  
      const blogDetails = await BlogEntry.findOne({ _id: blogId });
      blogDetails.body = body;
      blogDetails.title = title;
      blogDetails.ModifiedOn = Date.now();
  
      blogDetails.save();
      return res.status(200).json({ message: true });
  
    }
  
  }