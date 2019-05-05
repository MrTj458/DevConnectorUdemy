const express = require('express')
const { check, validationResult } = require('express-validator/check')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
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

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      const user = await User.findOne({ email })

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email or password is incorrect' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email or password is incorrect' }] })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      const token = await jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 3600,
      })

      return res.json({ token })
    } catch (err) {
      console.error(err)
      return res.status(500).send('Server error')
    }
  }
)

module.exports = router
