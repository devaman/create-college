var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var api = require('./routes/api');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
const cors = require('cors');
var app = express();

mongoose.connect(config.dbConfig.database,{ useUnifiedTopology: true ,useNewUrlParser: true }).then(
  () => { console.log("Mongodb Connected.") },
  err => { console.log("Mongodb Connection error: "+err)}
  );
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//CORS-ENABLE

app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client','build')));


//passport
app.use(passport.initialize());

app.use('/api', api);
app.use('/', index);
app.use(function(req, res) {
  // Invalid request
        res.status(404).json({
          msg:"Route not found"
        });
  });


// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send('error');
// });

module.exports = app;
