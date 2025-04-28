const express = require("express");
const multer = require("multer");
const { searchUsers, getProfileController, followUserController, suggestionController, unfollowUserController, updateProfilePicController, getProfilePicController, getFollowersController, getFollowingController, getUsersFollowersController } = require("../controllers/userController.js");
const {requireSignin} = require("../middleware/authMiddleware.js");

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post("/search",requireSignin,searchUsers);
router.get("/profile/:userId",getProfileController);
router.get("/following/:userId",requireSignin,getFollowingController);
router.get("/followers/:userId",requireSignin,getFollowersController);

router.get("/suggestion",requireSignin,suggestionController);

router.post("/follow",requireSignin,followUserController);
router.post("/unfollow",requireSignin,unfollowUserController);

//getProfilePic

router.post("/updateProfilePic",requireSignin,updateProfilePicController);
router.put("/updateProfilePic",requireSignin,upload.single("file"),updateProfilePicController);

module.exports = router;