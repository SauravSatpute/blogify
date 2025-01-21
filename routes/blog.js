const { Router } = require("express");
const Blog = require("../models/blog");
const multer = require("multer");
const path =require("path");
const Comment = require("../models/comment");
const blogRouter = Router()

blogRouter.get("/add-new",(req, res) => {
    return res.render("addBlog",{
        user : req.user
    })
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })

const upload = multer({storage : storage})


blogRouter.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");

    return res.render('blog', {
      user : req.user,
      blog : blog,
      comments : comments
    })
})


blogRouter.post("/comment/:blogId", async (req, res) => {
  console.log(req.body.content)
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id
  })

  return res.redirect(`/blog/${req.params.blogId}`)
})


blogRouter.post("/", upload.single("coverImage"), async (req, res) => {
//    console.log(req.body);
    const  {title, body} = req.body;

    const blog = await Blog.create({
        body,
        title,
        createdBy : req.user._id,
        coverImageUrl : `/upload/${req.file.filename}`
    });

   return res.redirect(`/blog/${blog._id}`)
})


module.exports = blogRouter