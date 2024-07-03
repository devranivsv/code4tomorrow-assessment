const bcrypt = require("bcryptjs");

// Import services
const { userService } = require("../services");

//Import utils
const { jwtUtils } = require("../utils");

// Controller: Register user
const registerUser = async (req, res) => {
  try {
    const payload = req.body;

    if (await userService.doesEmailExist(payload.email)) {
      return res.status(400).send({
        hasError: true,
        message: "Email already exist",
      });
    }

    const user = await userService.createUser(payload);

    return res.status(200).send({
      hasError: false,
      message: "User Created",
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      hasError: true,
      message: "Internal Server Error",
    });
  }
};

// Controller: Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      console.log(isPasswordCorrect);

      if (isPasswordCorrect) {
        const token = jwtUtils.generateToken({ email });

        return res.status(200).send({
          hasError: false,
          data: { token },
        });
      }
      return res.status(200).send({
        hasError: true,
        message: "Incorrect Password",
      });
    }

    return res.status(200).send({
      hasError: true,
      message: "User Not Found",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      hasError: true,
      message: "Internal Server Error",
    });
  }
};

// Controller: Get user
const getUser = async (req, res) => {
  try {
    const { user } = req;

    return res.status(200).send({
      hasError: false,
      data: user,
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
  registerUser,
  loginUser,
  getUser,
};
