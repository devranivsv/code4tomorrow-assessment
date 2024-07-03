// Import packages
const router = require("express").Router();

// Import controllers
const { authController } = require("../controllers");

// Import middlewares
const { authMiddleware } = require("../middlewares");

router.post("/register", authController.registerUser);

router.post("/login", authController.loginUser);

router.get("/user", authMiddleware.authUser, authController.getUser);

module.exports = router;
