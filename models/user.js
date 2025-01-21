const mongoose = require("mongoose")
const { createHmac, randomBytes} = require('crypto');
const { createTokenForUser } = require("../services/authentication");


let userSchema = new mongoose.Schema({
   fullName : {
    type : String,
    required : true
   },
   email : {
    type : String,
    required  : true,
    unique : true
   },
   salt : {
    type : String
   },
   password : {
    type : String,
    required : true
   },
   profileImgUrl : {
    type : String,
    default : "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
   },
   role : {
    type : String,
    enum : [ "USER", "ADMIN"],
    default : "USER"
   }
},
{
    timestamps : true
});

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) {
        return;
    }

    // salt random string
    const salt = randomBytes(16).toString()
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex") 

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if(userProvidedHash !== hashedPassword) {
        throw new Error("Incorect Password");
    }

    const token = createTokenForUser(user);

    return token
})


const User = mongoose.model("User",userSchema);

module.exports = User;