var bodyParser = require("body-parser"),
	mongoose	= require("mongoose"),
	express 	= require("express"),
	app			= express();

//APP CONFIG
mongoose.connect("mongodb://localhost/quora");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// Post Model Configration
var blogSchema = new mongoose.Schema({
	title: String,
	body: {type: String, default: "No Ans Yet |  Please answer this question.."},
	created: {type: Date, default: Date.now},
	flag: {type: Boolean, default: false}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Do you know anything about moon.?"
// });

app.get("/", function(req,res){
	Blog.find({flag: true}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

app.get("/post/:id", function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				console.log(err);
			} else {
				res.render("show", {blog: foundBlog});
			}
		});
});

app.get("/post/:id/edit", function(req, res){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				console.log(err);
			} else{
				res.render("edit", {post: foundBlog});
			}
		});
});

app.post("/post/:id/edit", function(req, res){
		Blog.findByIdAndUpdate(req.params.id, {
			title: req.body.title,
			body: req.body.answer,
			flag: true
		},
		function(err, updated){
			if(err){
				console.log(err);
			} else{
				res.redirect("/");
			}
		});
});

app.post("/post/:id/delete", function(req,res){
		Blog.findByIdAndRemove(req.params.id, function(err){
			if(err){
				console.log(err);
			} else {
				res.redirect("/");
			}
		});
});

app.get("/answer", function(req,res){
	Blog.find({flag: false}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("answer", {blogs: blogs});
		}
	});
});

app.get("/new", function(req, res){
			res.render("new");
});

app.post("/quora", function(req, res){
			Blog.create({title: req.body.na}, function(err, newPost){
				if(err){
					res.render("new");
				} else {
					res.redirect("/answer");
				}
			});
});


app.listen(3000, function(){
	console.log("Hey the new Quora is just Started..");
});