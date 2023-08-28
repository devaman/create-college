# ismy.ml
## Routes
1. get '/login ' ====> passporjs =======> github auth =======> our app(with user details) ===>store in db => session => deserialize 
```
 The route is using the passportjs to authenticate user from the github and get all the details of user and store them on the db more refence in database 
 The etire session of user will be stored in the cookies and then send to the frontend so that every request will be having the cookies sesson token to parse the further request 
```
2. get '/getUserDetails' => logged in using session cookie => get the details via sending the response to frontend (to be implemented)
