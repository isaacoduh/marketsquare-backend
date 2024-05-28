const User = require("../user/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createAccount = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "You must enter your full name." });
    }

    if (!password) {
      return res.status(400).json({ error: "You must enter a password." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "The email address is already in use." });
    }

    // // subscription
    const user = new User({ email, password, firstName, lastName });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    const result = await user.save();
    const payload = { id: result.id };

    // mail gun for signup
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.status(200).json({
      success: true,
      token: token,
      user: {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        role: result.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Bad Request" });
  }
};

module.exports = { createAccount };
