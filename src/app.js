const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer');
const cloudinary = require('cloudinary')
const helmet = require('helmet');


const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())
app.use(helmet())

const mongodb_conn_module = require('./mongodbConnModule');
var db = mongodb_conn_module.connect();
// var dbimg = mongodb_conn_module.connectImage();
var upload = multer({ dest: './uploads/'});


var Post = require("../models/post");
// var Img = require("../models/image")

cloudinary.config({
 cloud_name: 'dcpuysglb',
 api_key: '297185572485971',
 api_secret: '_sRo7YTPAp-FciS_Da7dYjYbbb0'
 });

async function saveimage(sid, info) {
  console.log("hello ");
  console.log("hello sid", sid);
  console.log("hell oinfo ", info);
  info['sid'] = sid
  console.log("changed", info);
  return info
};


app.post('/posts/img', upload.single('file'), function(req,res){
  // console.log("try all", req);
  console.log("req.filepath", req.file.path);
  console.log("testing", req.file);
  let sid = req.body.description
  var imgurl = "";
  var safeurl = "";
  var split = req.file.path.split('/')
  var imgid = split[1];
  cloudinary.uploader.upload(req.file.path, function(req) {
    console.log("req1", req);
    imgurl = req.url;
    safeurl = req.secure_url;
    var info = saveimage(sid, req)
    Post.findById(sid, 'netid name date program grade subject nid prof url', function (error, post) {
      console.log("post stuff", post);
      console.log("sid", sid);
      if (error) { console.error(error); }
      console.log("req.url", req.url);
      post.url = req.url
      post.save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true
        })
      })
      console.log("post post", post);
    })

  })
});

//opens API endpoint called posts which receives http POST method
//to create a new record for Post model
app.post('/posts', (req, res) => {
  var db = req.db;
  console.log("db hellos",db);
  var netid = req.body.netid;
  var name = req.body.name;
  var date = req.body.date;
  var program = req.body.program;
  var grade = req.body.grade;
  var subject = req.body.subject;
  var nid = req.body.nid;
  var prof = req.body.prof;
  var url;
  if (req.body.url == undefined) {
    console.log("url undef");
    url = ''
  } else {
    url = req.body.url
  }
  var new_post = new Post({
    netid: netid,
    name: name,
    date: date,
    program: program,
    grade: grade,
    subject: subject,
    nid: nid,
    prof: prof,
    url: url,
  })

  new_post.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})





// Fetch all posts
app.get('/posts', (req, res) => {
  Post.find({}, 'netid name date program grade subject nid prof url', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

// Fetch single post
app.get('/post/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'netid name date program grade subject nid prof url', function (error, post) {
    if (error) { console.error(error); }
    res.send(post)
  })
})


// Update a post
app.put('/posts/:id', (req, res) => {
  var db = req.db;
  Post.findById(req.params.id, 'netid name date program grade subject nid prof url', function (error, post) {
    if (error) { console.error(error); }
    post.netid = req.body.netid
    post.name = req.body.name
    post.date = req.body.date
    post.url = req.body.url
    post.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a post
app.delete('/posts/:id', (req, res) => {
  var db = req.db;
  Post.remove({
    _id: req.params.id
  }, function(err, post){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})


//port server is running
app.listen(process.env.PORT || 8081)
