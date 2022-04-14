//jshint esversion:8

import path from 'path';
const __dirname = path.resolve();

import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";

import dotenv from "dotenv";
dotenv.config();

import mongoose from 'mongoose';

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
let port = 3000; 

const aboutContent = "THIS IS JUST A BASIC JOURNAL SITE, YOU CAN STORE YOUR BASIC JOURNALS HERE";
const contactContent = "CONTACT ME PAGE.";

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.URL);
}


const postSchema = {
  title: String,
  content: String
 };

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
 
  Post.find({}, function(err, posts){
    if (!err) {
      res.render("home", {
        posts: posts
      });
    }
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {contactContent: contactContent});
});

app.get("/about", (req, res) => {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/compose", (req, res) => {

  res.render("compose");
});

// LOADING THE POST PAGE URL USING THE URL OF THE POST
app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, (err, post) => {
      res.render("post", {newPostTitle: post.title, newPostText: post.content});
    });
});

app.get("/delete/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findByIdAndRemove({_id: requestedPostId}, (err, doc) => {
      if (!err) {
          res.redirect('/');
      } else {
          console.log('Failed to Delete user Details: ' + err);
      }
  });
});

app.get("/deleteAll", function(req, res) {

  // const requestedPostId = req.params.postId;

  Post.deleteMany({}, (err, doc) => {
      if (!err) {
          res.redirect('/');
      } else {
          console.log('Failed to Delete All user Details: ' + err);
      }
  });
});

app.post("/compose", (req,res) => {

  const post = new Post ({
    title: req.body.journalTitle,
    content: req.body.journalText
  });

  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });

});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
