const express = require("express");
const { sendOtpForSignupController, verifyOtpForSignupController, logoutController, checkAuthController, SigninController } = require("../controllers/authController.js");
const { requireSignin } = require("../middleware/authMiddleware.js");
const router = express.Router();

//signin
router.post("/signup-send",sendOtpForSignupController);
router.post("/signup-verify",verifyOtpForSignupController);

//login
router.post("/signin",SigninController);

//checkUser authorized or not
router.get("/check",requireSignin,checkAuthController);

router.get("/logout",logoutController);





module.exports = router;