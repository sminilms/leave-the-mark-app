var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var chalk = require('chalk');

var db = require('./models/db.js');
var routes = require('./routes/route.js');
var user = require('./routes/user.js');
var story = require('./routes/story.js');
var app = express();

app.set('view engine','ejs');
//app.engine('html', require('ejs').renderFile); 

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({secret:"okmijnuhbygvtfcrdx",resave:true,saveUninitialized:true}));

app.get('/',routes.index);
app.get('/login',routes.login);
app.get('/register',routes.register);
app.get('/stories',story.stories);
app.get('/logout',user.logout);
app.get('/new-story',routes.newStory);
app.get('/stories/:story',story.getStory);
app.get('/techStack',routes.techStack)

app.post('/authenticate',user.login);
app.post('/newUser',user.doCreate);
app.post('/add-story',story.addStory);
app.post('/stories/:slug/saveComment',story.addComments);

app.use(function(req,res){
    console.log(chalk.red("Error 404"));
    res.status(404).render('404');
});

app.use(function(err,req,res,next){
    console.log(chalk.red("500 server error " + err));
    res.status(500).render('500');
});

var port = process.env.PORT || 8080;

var server = app.listen(port, function(req,res){
    console.log("Catch the action at http://localhost:"+port);
});