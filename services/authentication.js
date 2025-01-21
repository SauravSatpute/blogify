const JWT = require("jsonwebtoken")
const secret = "@marvelSuperheros@$123"

function createTokenForUser(user) {
    const payload = {
        _id : user._id,
        email : user.email,
        profileImgUrl : user.profileImgUrl,
        role : user.role
    }

    console.log(payload)

    const token = JWT.sign(payload, secret);

    return token;
}

function validateToken(token) {
    const payload = JWT.verify(token, secret);

    return payload;
}


module.exports = {
    createTokenForUser,
    validateToken
}