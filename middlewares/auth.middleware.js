// Import packages
const jwt = require("jsonwebtoken");

// Import services
const { userService } = require("../services");

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token) {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        if (email) {
          const user = await userService.getUserByEmail(email);
          if (user) {
            delete user.password;
            req.user = user;
            return next();
          }
        }
      }
    }
    return res.status(403).send({
      hasError: true,
      message: "Authorization Failed!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      hasError: true,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  authUser,
};
