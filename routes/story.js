var mongoose = require('mongoose');
var Story = mongoose.model('Story');

exports.stories=function(req,res){
    Story.find({}, function(err, stories){
        res.render('home', {
            stories:stories, session:req.session
        });
    });

}

exports.addStory=function(req,res){
    var title=req.body.title;
    var imgLink=req.body.imageLink;
    var summary=req.body.summary;
    var post = req.body.content;
 
    var newstory=new Story();
    newstory.author=req.session.username;
    newstory.title=title;
    newstory.imageLink=imgLink;
    newstory.created_at=Date.now();
    newstory.summary=summary;
    newstory.content=post;

    var lowercaseTitle=title.toLowerCase();
    var slug=lowercaseTitle.replace(/[^a-zA-Z0-9 ]/g, "");
    var addingHyphen=slug.replace(/\s+/g, '-');

    newstory.slug=addingHyphen;
 
    newstory.save(function(err,savedStory){
        if(err){
          console.log("Unable to save the story, please try again");
          var message="Unable to save the story, please try again";
          //res.render("register",{errorMessage:message});
          return res.status(500).send();
        }else{
          //req.session.newuser=savedUser.username;
          //res.render("home",{session:req.session});
          res.redirect("/stories");
        }
    });

}

exports.getStory=function(req,res){
    var url=req.params.story;
    Story.findOne({slug:url}, function(err, story){
        res.render('story', {
            story:story, session:req.session
        });
    });

}

exports.addComments=function(req,res){
    var comment=req.body.comment;
    var commented_by=req.session.username;
    var created_at=Date.now();
    var url=req.params.slug;
 
    Story.findOne({slug:url},function(err,story){
        story.comments.push({body:comment,commented_by:commented_by,date:created_at})
        story.save(function(err,savedStory){
            if(err){
                console.log("Error saving comment");
                var message="Error saving comment";
                //res.render("register",{errorMessage:message});
                return res.status(500).send();
              }else{
                //req.session.newuser=savedUser.username;
                res.render("story",{story:story,session:req.session});
              }
        });
        
    });

}