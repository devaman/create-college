var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('dotenv').config()
var api = require('./routes/api');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');
var cookieParser = require('cookie-parser')

const cookieSession = require('cookie-session')
const cors = require('cors');
mongoose.connect(config.dbConfig.database, { useUnifiedTopology: true, useNewUrlParser: true }).then(
  () => { console.log("Mongodb Connected.") },
  err => { console.log("Mongodb Connection error: " + err) }
);
// 
// 

const next = require('next')
console.log(process.argv);

const dev = process.env.NODE_ENV !== 'production'&&process.env.NODE_ENV !== 'devpro'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare()
  .then(() => {
    const server = express()
    server.use(cookieParser())
   
    server.use(cors());
    server.use((req, res, next) => {
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      next();
    });
    server.use(logger('dev'));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(express.static(path.join(__dirname, 'assets')));


    //passport
    server.use(cookieSession({
      name: 'session',
      keys: ['deveamit'],
      maxAge:7*24*60*60*1000,
      domain: process.env.NODE_ENV==="production"?'ismy.institute':null
    }))
    server.use(passport.initialize());

    server.use(passport.session());
    
    server.use('/', api(app));

    // server.use('/', index);
    server.get('*', (req, res) => {
    
      return handle(req, res)
    })

    


    server.listen(3000, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
