const { Router } = require("express");
const User = require("../models/user")

const userRouter = Router();

userRouter.get("/signin", (req, res) => {
    return res.render("signin");
})

userRouter.get("/signup", (req, res) => {
    return res.render("signup");
})

userRouter.post("/signup", async (req, res) => {
    const { fullName, email, password} = req.body;

    await User.create({
        fullName,
        email,
        password
    })

    return res.redirect("/");

})


userRouter.post("/signin", async (req,res) => {
    try {
        const {email, password} = req.body;
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    }catch(err) {
        return res.render("signin", {
            error : "Incorrect email or password."
        })
    }

})

userRouter.get("/logout", (req, res) => {
    
    
    res.clearCookie("token").redirect("/")
})


module.exports = userRouter