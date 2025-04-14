const jwt = require("jsonwebtoken");

const requireSignin = (req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized- no token"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-wrong token"});
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
module.exports = {requireSignin};