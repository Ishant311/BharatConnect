const userModel = require('../models/userModel.js');
const postModel = require('../models/postModel.js');
const cloudinary = require('../lib/cloudinary.js');
const mongoose = require('mongoose');
const { options } = require('../routes/userRoutes.js');

const searchUsers = async (req,res)=>{
    try {
        const search = req.query.name;
        if(!search){
            return res.status(400).json({message:"Search field is required"});
        }
        const users = await userModel.aggregate([
            {
                $match:{
                    $or: [
                    { userName: { $regex: search, $options: 'i' } },
                    { userId: { $regex: search, $options: 'i' } } 
                    ]
                },

            },
            {
                $project:{
                    userName:1,
                    userId:1,
                    followersCount:{$size:"$followers"},
                    profilePic:1,
                }
            },
            {
                $sort:{followersCount:-1}
            },
            {
                $limit:10
            }
        ])
        return res.status(200).json({users});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}

const getProfileController = async (req,res)=>{
    try {
        const userId = req.params.userId;
        const user = await userModel.find({
            userId:userId
        }).select("-password -likedPosts -savedPosts");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({user});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
const followUserController = async (req,res)=>{
    try {
        const {followId} = req.body;
        const userId = req.user.id;
        if(!followId){
            return res.status(400).json({message:"FollowId is required"});
        }
        if(followId === userId){
            return res.status(400).json({message:"You cannot follow yourself"});
        }
        const user = await userModel.findByIdAndUpdate(userId,{
            $addToSet:{following:followId}
        },{new:true});
        const follow = await userModel.findByIdAndUpdate(followId,{
            $addToSet:{followers:userId}
        },{new:true});
        if(!user || !follow){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Followed successfully"});
    } catch (error) {
        res.status(500).json({message:`${error.message} from followUser`});
    }
}
const unfollowUserController = async (req,res)=>{
    try {
        const {unfollowId} = req.body;
        const userId = req.user.id;
        if(!unfollowId){
            return res.status(400).json({message:"UnfollowId is required"});
        }
        if(unfollowId === userId){
            return res.status(400).json({message:"You cannot unfollow yourself"});
        }
        const user = await userModel.findByIdAndUpdate(userId,{
            $pull:{following:new mongoose.Types.ObjectId(unfollowId)}
        },{new:true});
        const userUnfollow = await userModel.findByIdAndUpdate(unfollowId,{
            $pull:{followers:new mongoose.Types.ObjectId(userId)}
        },{new:true});
        if(!user || !userUnfollow){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Unfollowed successfully"});
    } catch (error) {
        res.status(500).json({message:`${error.message} from unfollowUser`});
    }
}
const suggestionController = async (req,res)=>{
    try {
        const suggestions = await userModel.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId( req.user.id)}
                }
            },
            {
                $project: {
                    name: 1,
                    profilePic: 1,
                    userId: 1,
                    userName: 1,
                    followersCount: { $size: "$followers" }
                }
            },
            {
                $sort: {
                    followersCount: -1
                }
            },
            {
                $limit: 20
            }
        ]);        
        if(!suggestions){
            return res.status(400).json({message:"There are currently no users found"});
        }
        return res.status(200).json({suggestions});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`${error.message} from suggestion`});
    }
}


const updateProfilePicController = async(req,res)=>{
    try {
        const user = req.query.id;
        if(user !== req.user.id){
            return res.status(400).json({message:"You are trying to update other's profile pic"});
        }
        const profilePic = req.file;
        const userId = req.user.id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }
        const uploadRes = await cloudinary.uploader.upload(profilePic.path);

        const updateProfilePic = await userModel.findByIdAndUpdate(userId,{
            profilePic:uploadRes.secure_url
        },{new:true});

        if(!updateProfilePic){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Profile pic updated successfully"});
    } catch (error) {
        res.status(500).json({message:`${error.message} from updateProfilePic`});
    }
}
const getFollowersController = async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await userModel.find({userId:userId}).select("followers -_id").populate("followers","userId userName profilePic -_id");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.json({followers:user[0].followers});
    } catch (error) {
        return res.status(500).json({message:`${error.message} from getFollowers`});
    }
}
const getFollowingController = async(req,res)=>{
    try {
        const {userId} = req.params;
        const user = await userModel.find({userId:userId}).select("following").populate("following","userId userName profilePic -_id");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.json({following:user[0].following});
    } catch (error) {
        return res.status(500).json({message:`${error.message} from getFollowing`});
    }
}
// const getUsersFollowersController = async(req,res)=>{
//     try {
//         const {userId} = req.params;
//         const user = await userModel.findById(userId).select("followers -_id").populate("followers","userId userName profilePic -_id");
//         if(!user){
//             return res.status(400).json({message:"User not found"});
//         }
//         return res.json({followersCount:user.followers.length});
//     } catch (error){
//         return res.status(500).json({message:`${error.message} from getUsersFollowers`});
//     }
// }
module.exports = {
    searchUsers,
    getProfileController,
    followUserController,
    suggestionController,
    unfollowUserController,
    updateProfilePicController,
    getFollowersController,
    getFollowingController,
};