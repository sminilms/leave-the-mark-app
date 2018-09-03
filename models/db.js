var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var chalk = require('chalk');
var SALT_WORK_FACTOR = 10;

//var dbURI = 'mongodb://localhost/test'; 

var dbURI = 'mongodb://cyga:passw0rd@ds141942.mlab.com:41942/leavethemarks';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
    console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error', function(err){
    console.log(chalk.red('Mongoose connection error ' + err));
});

mongoose.connection.on('disconnected', function(){
    console.log(chalk.red('Mongoose disconnected'));
});

var userSchema = new mongoose.Schema({
    username: {type: String, unique:true},
    email:{type: String, unique:true},
    password:String
});

userSchema.pre('save', function(next){
    var user = this;
    console.log("Before registering the user");

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if(err) return next(err);

        console.log("Salte");
        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err);

            user.password = hash;
            console.log("Hash : " + hash);
            next();
        });
    });
    
});

userSchema.methods.comparePassword = function(candidatePassword, cb){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    });
};


mongoose.model('User', userSchema);

// Stories Schema

var storiesSchema = new mongoose.Schema({
    author:String,
    title: {type: String,unique:true},
    created_at:{type:Date,default:Date.now},
    summary:String,
    content: {type: String},
    imageLink:String,
    comments:[{body:String,commented_by:String,date:Date}],
    slug:String
  });
  
  // Build the User model
  
  mongoose.model( 'Story', storiesSchema,'stories');