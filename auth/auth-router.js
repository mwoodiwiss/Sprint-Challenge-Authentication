const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConfig");
const secrets = require("../config/secrets");
const router = express.Router();

router.post("/register", async (req, res, next) => {
    try {
      const newUser = await add(req.body)
      
      res.status(201).json(newUser)
    } catch (err) {
      next(err)
    }
  })
  
  router.post("/login", async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await db("users")
        .where({ username })
        .first();
      const passwordValid = await bcrypt.compare(password, user.password);
  
      if (user && passwordValid) {
        const token = jwt.sign(
          {
            subject: user.id,
            username: user.username
          },
          secrets.jwt,
          {
            expiresIn: "7d"
          }
        );
  
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          token: token
        });
      } else {
        res.status(401).json({
          message: "Invalid Credentials"
        });
      }
    } catch (err) {
      next(err);
    }
  });
  
  async function add(user) {
    
      user.password = await bcrypt.hash(user.password, 10)
    
      const [id] = await db("users")
        .insert(user)
     
      return findById(id)
    }
    
    function findById(id) {
      return db("users")
        .where({ id })
        .first("id", "username")
    }
  
  
  module.exports = router;
