const express = require("express");
const mongoose = require("mongoose");
const path = require("path")
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middlewares/authentication");


const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const Blog = require("./models/blog");

//Contants
const PORT = 8000;
const app = express();



// middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended : false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")))
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.get("/", async (req, res) => {

    const allBlogs = await Blog.find({});

    res.render("home", {
        user : req.user,
        blogs : allBlogs
    });
})




mongoose.connect('mongodb://127.0.0.1:27017/blogify')
.then(()=> {
    console.log("MongoDB connected.")
}).then(()=> {
    app.listen(PORT, () => {
        console.log(`App is listening on port number ${PORT}`);
    });
}).catch(err => console.log(err))






