var express    = require("express");
var   app        = express();
var  mongoose   = require("mongoose");
var bodyparser = require("body-parser");
var methodoverride = require("method-override");
//var expressSanitizer= require("express-sanitizer");// use to censor the words
    
     //app config
    mongoose.connect("mongodb://localhost:27017/RestBlogapp",{ useNewUrlParser: true ,useUnifiedTopology: true,useFindAndModify : false});
    

    app.set("view engine","ejs");
    //app.use(express.static("Public"));
    app.use(express.static(__dirname+"/public"));

    app.use(bodyparser.urlencoded({extended:true}));
  //  app.use(expressSanitizer());
    app.use(methodoverride("_method"));                 // "_method" could be named anything
    //MONGOOSE MODEL CONFIG
    var blogschema = new mongoose.Schema({
          title : String,
          image : String,
          body : String ,
          created :{ type:Date,default:Date.now}
    }) ;
     var blog = mongoose.model("blog",blogschema);
    //REST ROUTES:
    app.get("/",(req,res)=>{
res.redirect("/blogs");
    });
    //INDEX 
    app.get("/blogs",(req,res)=>{
        
       blog.find({},(err,blogs)=>{
        if(err){console.log(err);}
        else{
            res.render("index",{blogs:blogs});
        }
       });

    });

    //NEW
    app.get("/blogs/new",(req,res)=>{
      res.render("new");
    });
    //CREATE
    app.post("/blogs",function(req,res){

      //  req.body.blogs.body= req.sanitize(req.body.blogs.body);
        //create blog
    blog.create(req.body.blog,(err,newblog)=>{
           if(err){res.render("new");}
           else
           //then redirect to index
           {res.redirect("/blogs");}
       })
    });
//SHOW
app.get("/blogs/:id",(req,res)=>{
    //req.body.blogs.body= req.sanitize(req.body.blogs.body);

blog.findById(req.params.id,(err,foundblog)=>{
if(err){{res.redirect("/blogs")};}
else{ res.render("show",{blog:foundblog});}
});
});

//EDIT
app.get("/blogs/:id/edit",(req,res)=>{
    blog.findById(req.params.id,(err,foundblog)=>{
          if(err){ res.redirect("/blogs");}
          else{ res.render("edit",{blog:foundblog});}
    });

});
//UPDATE
app.put("/blogs/:id",(req,res)=>{
blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,updatedblog)=>{
    if(err){ res.redirect("/blogs");}
 else{res.redirect("/blogs/"+req.params.id);}
});
});
//DESTROY
    app.delete("/blogs/:id",(req,res)=>{
        blog.findByIdAndRemove(req.params.id,(err)=>{
            if(err){res.redirect("/blogs");}
            else{res.redirect("/blogs");}
        });
    });


    app.listen(9000,(res,err)=>{
        console.log("Server Started!");
    });