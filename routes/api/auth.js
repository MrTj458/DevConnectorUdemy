const express = require('express')
const auth = require('../../middleware/auth')
const User = require('../../models/User')

const router = express.Router()

// @route   GET api/auth
// @desc    Test Route
// @access  public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

module.exports = router
