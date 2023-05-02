const express = require("express");
const User = require("../models/Admin");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchadmin = require("../middleware/fetchadmin");
const Admin = require('../models/Admin')

const router = express.Router();
const JWT_SECRET = "aakashdeyisa@#$goodboy";

//register user
router.post(
    "/createuser",
    [
      body("name", "Enter a valid name").isLength({ min: 3 }),
      body("email", "Enter a valid email").isEmail(),
      body("password", "Enter a valid password").isLength({ min: 5 }),
    ],
    async (req, res) => {
      let success = false
      // if there is errors return Bad request return the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      // check wheather the email is exist already
      try {
        let user = await User.findOne({ success, email: req.body.email });
        if (user) {
          return res.status(500).json({ success, error: req.body.email, message: "Alredy exist" });
        }
        const salt = await bcrypt.genSaltSync(10);
        const hashSec = await bcrypt.hashSync(req.body.password, salt);
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashSec,
        });
        const data = {
          user: {
            id: user.id,
          },
        };
        const jwtData = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({success,Authtoken: jwtData });
  
        // res.json({ nice: "store into database", user });
      } catch (error) {
        success = false
        console.log(error.message);
        res.status(500).json({ error: "error occcoure" });
      }
    }
  );
  // after register login user
  router.post(
    "/login",
    [
      body("email", "Enter a valid email").exists(),
      body("password", "Enter a valid password").exists(),
    ],
    async (req, res) => {
      // if there is errors return Bad request return the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(500).json({ success,error: "Enter valid Email" });
        }
        const passworrdCompair = await bcrypt.compare(password, user.password);
        if (!passworrdCompair) {
          success = false
          return res.status(500).json({ success, success,error: "Enter valid password" });
        }
        const data = {
          user: {
            id: user.id,
          },
        };

        const jwtData = jwt.sign(data, JWT_SECRET);
        let success = true
        res.json({ success,Authtoken: jwtData });
      } catch (error) {
        return res.status(500).json({ error: "internal server error" });
      }
    }
  );
  router.post('/getuser', fetchadmin,  async (req, res) => {

    try {
     const userId = req.user.id;
      const user = await Admin.findById(userId).select("-password") // select all information expect password select("-password")
      res.send(user.email)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
module.exports = router