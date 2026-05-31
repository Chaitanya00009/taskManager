const userModel = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const existUser = await userModel.findOne({ email });
    if (!existUser) {
      const hashedpassword = await bcrypt.hash(password, 10);
      const newUser = new userModel({
        name,
        email,
        password: hashedpassword,
        role: role || "user",
      });
      const savedUser = await newUser.save();
      res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "Email already exists" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const existEmail = await userModel.findOne({ email });
    if (existEmail) {
      const isMatch = await bcrypt.compare(password, existEmail.password);
      if (isMatch) {
        const token = jwt.sign(
          { userId: existEmail._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );
        return res
          .status(200)
          .json({ message: "Login successful !", token: token });
      } else {
        return res.status(400).json({ message: "Invalid Credentials !" });
      }
    } else {
      return res.status(400).json({
        message: "The user doesn't exist. Please sign up before logging in",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { signup, login };
