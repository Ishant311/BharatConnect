const express = require("express");
const { searchUsers, getProfileController, followUserController, suggestionController, unfollowUserController, updateProfilePicController, getProfilePicController, getFollowersController, getFollowingController, getUsersFollowersController } = require("../controllers/userController.js");
const {requireSignin} = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/search",requireSignin,searchUsers);
router.get("/profile/:userId",getProfileController);
router.get("/following",requireSignin,getFollowingController);
router.get("/followers",requireSignin,getFollowersController);

router.get("/suggestion",requireSignin,suggestionController);

router.post("/follow",requireSignin,followUserController);
router.post("/unfollow",requireSignin,unfollowUserController);

//getProfilePic

router.post("/updateProfilePic",requireSignin,updateProfilePicController);

module.exports = router;