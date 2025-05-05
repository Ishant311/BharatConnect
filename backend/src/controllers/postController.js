const postModel = require('../models/postModel.js');
const cloudinary = require('../lib/cloudinary.js');
const fs = require('fs');
const userModel = require('../models/userModel.js');
const mongoose= require('mongoose');
const path = require('path');
const { analyzeImage } = require('../lib/geminiImage.js');

/*TODO: 1. query optimisation
*/
const postController = async(req,res)=>{
    try {
        const file = req.file;
        const {text} = req.body;
        if(!file && !text){
            return res.status(400).json({message:"Please provide a file or text"});
        }
        const userId = req.user.id;
        const user = req.query.id;
        if(userId !== user){
            return res.status(400).json({message:"You are trying to create post for other user"});
        }
        const upload = await cloudinary.uploader.upload(file.path,{
            resource_type:"auto",
        })
        if(file.mimetype.startsWith("video")){
            const post = await postModel.create({
                text:text,
                video:upload.secure_url,
                createdBy:userId,
                type:"video",
            })
            await userModel.findByIdAndUpdate(userId,{
                $addToSet:{posts:post._id}
            })
            fs.unlinkSync(file.path);
            return res.status(200).json({message:"Post created successfully",post});
        }else if(file.mimetype.startsWith("image")){
            const result = await analyzeImage(file.path,"I want one (or atmost two) and only one word category for this image and no extra chit-chat");
            const category = result;
            const post = await postModel.create({
                text:text,
                image:upload.secure_url,
                createdBy:userId,
                type:"image",
                category:category,
            })
            await userModel.findByIdAndUpdate(userId,{
                $addToSet:{
                    posts:post._id,
                    category:category,
                }
            })
            fs.unlinkSync(file.path);
            return res.status(200).json({message:"Post created successfully",post});
        }
        return res.status(400).json({message:"Please provide a valid file"});
    }catch (error) {
        return res.status(500).json({message:error.message});
    }
}
const getPostLikesController = async(req,res)=>{
    try{
        const postId = req.query.id;
        if(!postId){
            return res.status(400).json({message:"Post id is required"});
        }
        const post = await postModel.findById(postId).select("likes")
        if(!post){
            return res.status(400).json({message:"Post not found"});
        }
        console.log(post)
        return res.status(200).json({message:"Post likes fetched successfully",likes:post});
    }
    catch(error){
        return res.status(500).json({message:error.message});
    }
}

//user-created-posts
const getPostController = async(req,res)=>{
    try {
        const id = req.query.id;
        if(!id){
            return res.status(400).json({message:"Post id is required"});
        }
        const posts = await userModel.find({
            userId:id,
        }).select("posts -_id").populate({
            path:"posts",
            options:{
                sort:{createdAt:-1},
                limit:10,
                skip:0,
            }
        })
        if(!posts){
            return res.status(400).json({message:"No posts found"});
        }
        return res.status(200).json({posts:posts[0].posts});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
const getSinglePostController = async(req,res)=>{
    try {
        const pid = req.params.id;
        if(!pid){
            return res.status(400).json({message:"Post id is required"});
        }
        const post = await postModel.findById(pid).select("profilePic text image video createdAt comments likes -_id").populate("createdBy","userName userId profilePic").populate("comments.commentBy","userName userId profilePic").sort({createdAt:-1});
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        return res.status(200).json(post);
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
//followed-posts
const getFollowedPostsController = async(req,res)=>{
    try {
        const id = req.user.id;
        const followsPost = await userModel.findById(id).select("following -_id");
        const posts = await postModel.find({createdBy:{$in:followsPost.following}}).limit(20).populate("createdBy","userName userId profilePic").sort({createdAt:-1});
        if(!posts){
            return res.status(400).json({message:"No followed posts found"});
        }
        return res.status(200).json({posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
}
const getCommentCntController = async(req,res)=>{
    try {
        const postId = req.query.pid;
        if(!postId){
            return res.status(400).json({message:"Post id is required"});
        }
        const postCommentsCnt = await postModel.aggregate({
            $match:{
                _id:new mongoose.Types.ObjectId(postId)
            },
            $project:{
                _id:0,
                commentsCount: {$size:"$comments"},
            }
        })
        if(!postCommentsCnt){
            return res.status(404).json({message:"Post not found"});
        }
        return res.status(200).json({message:"Post comments fetched successfully",comments:postCommentsCnt[0].commentsCount});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
const getCommentsController = async(req,res)=>{
    try {
        const postId = req.query.pid;
        if(!postId){
            return res.status(400).json({message:"Post id is required"});
        }
        const postComments = await postModel.findById(postId).select("comments").populate("comments").sort({createdAt:-1});
        if(!postComments){
            return res.status(404).json({message:"Post not found"});
        }
        return res.status(200).json({message:"Post comments fetched successfully",comments:postComments[0].comments});
    } catch (error) {
        return res.status(500).json({message:error.message});
    }
}
const likePostController = async(req,res)=>{
    try {
        const {postId} = req.body;
        const userId = req.user.id;
        if(!postId){
            return res.status(400).json({message:"PostId is required"});
        }
        // const liked = await userModel.find({
        //     $and:[
        //         {_id:userId},
        //         {likedPosts:postId},
        //     ]
        // })
        // if(liked.length > 0){
        //     return res.status(400).json({message:"Already liked"});
        // }
        const post = await postModel.findByIdAndUpdate(postId,{
            $addToSet:{likes:userId}
        },{new:true}).select("likes category -_id");
        const likedPost = await userModel.findByIdAndUpdate(userId,{
            $addToSet:{
                likedPosts:postId,
                category:post.category,
            }
        },{new:true}).select("likedPosts -_id");
        if(!likedPost || !post){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Liked successfully",likedPost:likedPost.likedPosts});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`${error.message} from likePost`});
    }
}
const unlikePostController = async(req,res)=>{
    try {
        const {postId} = req.body;
        const userId = req.user.id;
        if(!postId){
            return res.status(400).json({message:"PostId is required"});
        }
        const post = await postModel.findByIdAndUpdate(postId,{
            $pull:{likes:new mongoose.Types.ObjectId(userId)}
        },{new:true});
        const unlikedPost = await userModel.findByIdAndUpdate(userId,{
            $pull:{likedPosts:new mongoose.Types.ObjectId(postId),
                category:post.category,
            }
        },{new:true}).select("likedPosts -_id");
        if(!unlikedPost || !post){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Unliked successfully",unlikedPost:unlikedPost.likedPosts});
    } catch (error) {
        res.status(500).json({message:`${error.message} from unlikePost`});     
        
    }
}
const commentPostController = async(req,res)=>{
    try {
        const {postId,comment} = req.body;
        const userId = req.user.id;
        if(!postId || !comment){
            return res.status(400).json({message:"PostId and comment are required"});
        }
        const date = new Date();
        const post = await postModel.findByIdAndUpdate(postId,{
            $addToSet:{comments:{text:comment,commentBy:userId,commentOn:date.toISOString()}},
        },{new:true});
        if(!post){
            return res.status(400).json({message:"Something went wrong"});
        }
        return res.status(200).json({message:"Commented successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`${error.message} from commentPost`});   
        
    }
}

const getLikedPostController = async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = req.query.id;
        if(userId !== user){
            return res.status(400).json({message:"You are trying viewing other's liked posts"});
        }
        const likedPosts = await userModel.findById(userId).select("likedPosts -_id");
        if(!likedPosts){
            return res.status(400).json({message:"No liked posts found"});
        }
        return res.status(200).json({likedPosts:likedPosts.likedPosts});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:`${error.message} from getLikePost`});
    }
}

const getSavedPostController = async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = req.query.id;
        if(userId !== user){
            return res.status(400).json({message:"You are trying viewing other's saved posts"});
        }
        const savedPosts = await userModel.findById(userId).select("savedPosts -_id").populate("savedPosts","text image video createdBy").sort({createdAt:-1});
        if(!savedPosts){
            return res.status(400).json({message:"No saved posts found"});
        }
        return res.status(200).json(savedPosts);
    } catch (error) {
        res.status(500).json({message:`${error.message} from getSavedPost`});   
        
    }
}
const getExplorePostController = async(req,res)=>{
    try {
        const userId = req.user.id;
        const categories = await userModel.findById(userId).select("category following -_id");
        const recommendedPosts = await postModel.find(
            {$and:[
                {createdBy:{$nin:categories.following}},
                {category:{$in:categories.category}}
            ]},
        ).limit(100).populate("createdBy","profilePic userId userName").sort({createdAt:-1});
        console.log(recommendedPosts);
        if(!recommendedPosts){
            return res.status(400).json({message:"No recommended posts found"});
        }
        return res.status(200).json({recommendedPosts});
    } catch (error) {
        res.status(500).json({message:`${error.message} from getSavedPost`});   
        
    }
}
const getAllPostsController= async(req,res)=>{
    try {
        const page = req.query.page || 0;
        const posts = await postModel.find({}).select("image video likes comments").limit(10).skip(page*10);
        return res.status(200).json(posts);
    } catch (error) {
        
    }
}

module.exports = {
    postController,
    getPostLikesController,
    getPostController,
    getCommentCntController,
    getCommentsController,
    likePostController,
    unlikePostController,
    commentPostController,
    getLikedPostController,
    getSavedPostController,
    getFollowedPostsController,
    getSinglePostController,
    getExplorePostController,
    getAllPostsController
}