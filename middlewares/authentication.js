const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCokieValue = req.cookies[cookieName];

        if(!tokenCokieValue)
            return next();

        try {
            const userPayload = validateToken(tokenCokieValue);
            req.user = userPayload; 
        }catch(err) {
    
        }

        return next();
    }

}

module.exports = {
    checkForAuthenticationCookie
}