const user = require('../models/users/user.js');
const Events = require('../models/events/events.js')
const College = require('../models/college/college.js')
const slugify = require('slugify')
exports.createEvent = async (req, res) => {


  const actualPage = '/createEvent'
  const eventId = req.query.eventId;
  req.eventId = eventId;
  const queryParams = { college: req.college, user: req.user, eventId }
  if (req.accepts(['html', 'json']) === 'json') {
    res.json({ user: req.user, college: req.college })
  } else
    res.locals.app.render(req, res, actualPage, queryParams)
}

exports.getEvent = async (req, res) => {

  let slug = req.params.eid;
  const actualPage = '/event/[eid].js'
  let event = await Events.findOne({slug}).populate({ path: 'organizer', model: 'user', select: 'username avtarUrl' });
  req.event = event;
  const queryParams = { college: req.college, user: req.user, event: event }
  if (req.accepts(['html', 'json']) === 'json') {
    res.json({ user: req.user, college: req.college, event: event })
  } else
    res.locals.app.render(req, res, actualPage, queryParams)
}

exports.getEvents = async (req, res, next) => {
  const currUser = req.user.userId;

  const userFound = await user.findOne({ userId: currUser });

  if (userFound) {

    user.findOne({ userId: currUser }).populate('events').exec((err, data) => {

      if (err)
        return res.json({ err: err })
      return res.json({ events: data })

    })
  }
  else {
    res.redirect('/')
  }


}

exports.addEvent = async (req, res, next) => {
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const location = req.body.location;
  const description = req.body.description;
  const userId = await user.findOne({ userId: req.user.userId });
  const title = req.body.title;


  const collegeName = req.user.college;

  const college_id = await College.findOne({ name: collegeName });



  const newEvent = new Events({
    slug:slugify(`${title}-${Math.random().toString(36).slice(8)}`,{lower:true}),
    college: college_id._id,
    description: description,
    location: location,
    startDate: startDate,
    endDate: endDate,
    organizer: userId._id,
    title: title,
    ModifiedOn: Date.now(),
    createdOn: Date.now()

  })
  newEvent.save();
  userId.events.push(newEvent._id);
  userId.save();
  college_id.event.push(newEvent._id);

  college_id.save();




  res.json({ message: true });
}



exports.getAllEvents = async (req, res, next) => {


  var perPage = 10
    , page = Math.max(0, req.query.index)

  College.findOne({ name: req.college.name }).populate({
    path: "event", model: 'events', select: { 'title': 1, 'organizer': 1, 'startDate': 1,'slug': 1 }, options: {
      limit: perPage,
      skip: page * perPage,
      sort: { ModifiedOn: -1 }
    }, populate: { path: 'organizer', model: 'user', select: { 'avtarUrl': 1, 'username': 1, 'college': 1 } }
  }).exec(function (err, doc) {
    if (err) { res.status(500).json(err); return; };
    Events.find({ category: "shared" }).select('title organizer startDate slug category').populate({ path: 'organizer', model: 'user', select: { 'avtarUrl': 1, 'username': 1, 'college': 1 }}).exec((err, docu) => {
      if (err) { res.status(500).json(err); return; };
      let arr = [...docu,...doc.event] ;
      arr = arr.filter((v,i,a)=>a.findIndex(t=>(t._id.equals(v._id)))===i);
      res.status(200).json({ events: arr });

    })
  });



}

exports.deleteEvent = async (req, res, next) => {

  const EventDetails = await Events.findOne({ _id: req.body._id }).populate({ path: 'organizer', model: 'user' });

  if (!EventDetails) {
    return res.status(302).json({ message: "Not found" });
  }


  const userDetails = await user.findOne({ userId: EventDetails.organizer.userId });


  const collegeDetails = await College.findOne({ name: userDetails.college });


  collegeDetails.event.remove(req.body._id);

  userDetails.events.remove(req.body._id);

  collegeDetails.save();

  userDetails.save();

  EventDetails.remove();


  return res.status(201).json({ message: "true" });

}

exports.registerForEvent = async (req, res, next) => {

  const user_Id = req.user._id;
  const event = await Events.findOne({ _id: req.body._id });

  var val = event.registeredUsers.includes(user_Id);

  if (val)
    return res.status(400).json({ message: false })

  event.registeredUsers.push(user_Id);



  const userDetails = await user.findOne({ _id: user_Id });

  if (!event.organizer.equals(user_Id)){
    userDetails.events.push(event._id);
    userDetails.save();
  }
  

  event.save();

  res.status(200).json({ message: 'Created' });


}

exports.getEventById = async (req, res) => {
  const eventId = req.params.id;

  event = await Events.findById(eventId)

  res.json({ event })
}
exports.modifyEvent = async (req, res, next) => {

  const eventId = req.params.id;

  const eventDetails = await Events.findOne({ _id: eventId });

  if (eventDetails == null || eventDetails == undefined) {
    return res.status(404).json({ message: false });
  }

  if (req.user._id.toString() !== eventDetails.organizer.toString()) {

    return res.status(400).json({ message: false });
  }


  eventDetails.ModifiedOn = Date.now();
  eventDetails.title = req.body.title;
  eventDetails.startDate = req.body.startDate
  eventDetails.endDate = req.body.endDate
  eventDetails.location = req.body.location
  eventDetails.description = req.body.description

  eventDetails.save();

  return res.status(200).json({ message: true });


}