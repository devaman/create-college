module.exports = {
  dbConfig: {
    secret: 'myauthenticationapp',
    database: ''
  },
  emailConfig: {
    service: 'SendGrid', // hostname
    auth: {
      user: 'apikey',
      pass: '',
    },
  },
  ROOT_URL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000',


  gitConfig: process.env.NODE_ENV === 'production' ? {
    clientID: "",
    clientSecret: "",
    accessToken: ""
  } : {

      clientID: "",
      clientSecret: "",
      accessToken: ""
    },


  jwttoken: {

    passkey: "devaman"
  }
};