const express = require('express');
const  multer  = require('multer');
const { requireSignin } = require('../middleware/authMiddleware.js');
const { postController, getPostLikesController, getPostController, getCommentCntController, getCommentsController, likePostController, unlikePostController, commentPostController, getLikedPostController, getSavedPostController, getFollowedPostsController, getSinglePostController, getExplorePostController, getAllPostsController } = require('../controllers/postController.js');

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

//post routes
router.post('/create-post', requireSignin,upload.single("file"),postController);
router.get("/get-posts",getPostController);
router.get("/get-posts/:id",getSinglePostController);
router.get("/followed-posts",requireSignin,getFollowedPostsController);


//like/unlike routes
router.post("/likePost",requireSignin,likePostController);
router.post("/unlikePost",requireSignin,unlikePostController);
router.get('/get-likes/count',getPostLikesController);


//comments routes
router.post("/comment",requireSignin,commentPostController);
router.get("/comment-count",getCommentCntController);
router.get("/get-comments",getCommentsController);

//liked and saved posts routes
router.get("/likedPosts",requireSignin,getLikedPostController);
router.get("/savedPosts",requireSignin,getSavedPostController);

//explore 
router.get("/explore",requireSignin,getExplorePostController);

//exploreAllPosts
router.get("/explore-all",requireSignin,getAllPostsController);

module.exports = router;