const express = require('express')
const auth = require('../../middleware/auth')

const router = express.Router()

// @route   GET api/auth
// @desc    Test Route
// @access  public
router.get('/', auth, (req, res) => {
  res.send('Auth Route')
})

module.exports = router
