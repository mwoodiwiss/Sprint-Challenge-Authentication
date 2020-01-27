const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets")

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization
      const decoded = jwt.verify(token, secrets.jwt)

      req.userId = decoded.subject
      next()
    } catch (err) {
      return res.status(401).json({ you: 'shall not pass!' })
    }
  }
