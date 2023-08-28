const mongoose = require('mongoose');
const config = require('../config/database');
const slugify = require('slugify');
const User = require("../models/users/user")
const Blog = require("../models/Blogs/Blog")
const Event = require("../models/events/events")
mongoose.connect(config.dbConfig.database, { useUnifiedTopology: true, useNewUrlParser: true }).then(
    () => {

        console.log("Connected ");
        mongoose.connection.db.collection("events", function (err, collection) {
            collection.find({}).toArray().then(users => {
                let arrayLen = users.length;
                console.log(arrayLen);

                users.forEach(async (doc) => {
                    adoc = new Event({
                        ...doc,
                        slug: slugify(`${doc.title}-${Math.random().toString(36).slice(8)}`, { lower: true })
                    })
                    adoc.isNew = false;
                    await adoc.save();
                    arrayLen--;
                    console.log(arrayLen);

                    if (arrayLen === 0) {
                        mongoose.connection.close();
                        console.log("Finished ");

                    }
                })
            })

        });


    },
    err => { console.log("Mongodb Connection error: " + err) }
);


