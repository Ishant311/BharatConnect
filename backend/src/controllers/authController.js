const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../lib/password.js');
const userModel = require('../models/userModel.js');
const nodemailer = require('nodemailer');
const redis = require("../lib/redisClient.js")

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
const sendOtpForSignupController = async (req, res) => {
    try {
        const { name, email, password, userId } = req.body;
        if (!email || !password || !userId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ email });
        const userid = await userModel.findOne({ userId });
        if (userid) {
            return res.status(400).json({ message: "User ID already exists" });
        }
        if (user) {
            return res.status(400).json({ message: "User Email already exists" });
        }
        const blocked = await redis.get(`blocked:${email}`);
        if (blocked) {
            const ttl = await redis.ttl(`blocked:${email}`);
            return res.status(400).json({ message: `Too many attempts try after ${Math.ceil(ttl / 60)}  minutes` });
        }
        const timeLeft = `timeLeft:${email}`;
        const time = await redis.get(timeLeft);
        if (time) {
            const ttl = await redis.ttl(timeLeft);
            return res.status(400).json({ message: `Please wait ${ttl}s before requesting a new OTP` });
        }
        const otp = generateOtp();
        await redis.set(`otp:${email}`, otp, 'EX', 300);
        await redis.set(`tries:${email}`, 0, 'EX', 300);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        const mailOptions = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for registeration',
            text: `Your OTP is ${otp}`
        });
        await redis.set(timeLeft, '1', 'EX', 60);
        return res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const verifyOtpForSignupController = async (req, res) => {
    try {
        const { email, password, otp, name, userId } = req.body;
        if (!password || !email || !otp || !userId) {
            return res.status(400).json({ message: "all fields are required" });
        }
        const blocked = await redis.get(`blocked:${email}`);
        if (blocked) {
            const ttl = await redis.ttl(`blocked:${email}`);
            return res.status(400).json({ message: `Too many attempts try after ${Math.ceil(ttl / 60)}  minutes` });
        }
        const tries = await redis.get(`tries:${email}`);
        await redis.set(`tries:${email}`, parseInt(tries) + 1, 'EX', 300);
        if (tries > 3) {
            await redis.set(`blocked:${email}`, 1, 'EX', 300);
            return res.status(400).json({ message: "Too many attempts try after 5 minutes" });
        }
        const storedOtp = await redis.get(`otp:${email}`);
        if (storedOtp === otp) {
            await redis.del(email);
            const user = await userModel.findOne({ email: email });
            const userid = await userModel.findOne({ userId });
            if (userid) {
                return res.status(400).json({ message: "User ID already exists" });
            }
            if (user) {
                return res.status(400).json({ message: "User email already exists" });
            }
            const hashedPassword = await hashPassword(password);
            const newUser = await userModel.create({ userName: name, email: email, password: hashedPassword, userId })
            const userDetails = await userModel.findById(newUser._id).select("-password -posts -likedPosts -savedPosts -followers -following -createdAt -updatedAt -__v");
            const token = jwt.sign({ userId: newUser.userId,id:newUser._id }, process.env.JWT_SECRET, { expiresIn: "4d" });
            res.cookie("jwt", token, {
                maxAge: 4 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true
            });
            return res.status(200).json({ message: "Signup successful", user: {
                userId: newUser.userId,
                userName: newUser.userName,
                _id: newUser._id,
                profilePic: newUser.profilePic
            }, token });
        }
        return res.status(400).json({ message: "Invalid OTP" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



const SigninController = async (req, res) => {
    try {
        const { userId, email, password } = req.body;
        if ((!email || !password) && (!userId || !password)) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({ $or:[
            { email: email },
            { userId: userId }
        ] }).select("_id userId email password userName profilePic");
            if (!user) {
                return res.status(400).json({ message: "User does not exist" });
            }
            else {
                const compare = await comparePassword(password, user.password);
                if (!compare) {
                    return res.status(400).json({ message: "Invalid email or password" });
                }
                const token = jwt.sign({ userid: user.userId,id:user._id }, process.env.JWT_SECRET, { expiresIn: "4d" });
                res.cookie("jwt", token, {
                    maxAge: 4 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                    secure: true
                });
                return res.status(200).json({ message: "Signin successful",user:{ userId: user.userId, userName: user.userName, _id: user._id , profilePic: user.profilePic }});
            }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const logoutController = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out successfully " });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
const checkAuthController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userDetails = await userModel.findById(req.user.id).select("-password -posts -likedPosts -savedPosts");
        return res.status(200).json({ message: "User is authenticated", user: userDetails });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    sendOtpForSignupController,
    verifyOtpForSignupController,
    SigninController,
    logoutController,
    checkAuthController
}