const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateUserInput = require('../../validation/user');

//Load User model
const User = require('../../model/User');

//Super User Router
//Update User info
//Super Private
//To do ---- Need to add authentication middleware and Move to a new controller
// request body can have name, avatar, isActive, in the page, all original value will be sent as default unless change for update
router.post('/super/user/:user_id', (req, res) => {
    const { errors, isValid } = validateUserInput(req.body);
    if (!isValid) {
        return res.status(404).json(errors);
    }

    User.findById(req.params.user_id).then(user => {
        if (!user) {
            errors.userNotFound = "User not Found";
            return res.status(404).json(errors);
        }

        user.name = req.body.name;
        user.avatar = req.body.avatar;
        user.isActive = req.body.isActive;

        user.save().then(user=>res.json(user));

    })
    .catch(err=>res.status(400).json(err));



})


// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get('/test', (req, res) => res.json({ "msg": "User works!!" }))

//@route GET api/users/resgister
// @desc Register users
// @access Public

router.post('/register', (req, res) => {

    //Validate user input
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exists';
            return res.status(400).json(errors)
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            })

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
                password: req.body.password

            })

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) { console.log(err) };
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })
            })
        }
    })
})

//@route GET api/users/login
// @desc Login users/Returning JWT token
// @access Public

router.post('/login', (req, res) => {

    //Validate user input
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    //Find user by Email
    User.findOne({ email }).then(user => {
        if (!user) {
            errors.email = "User not found";
            return res.status(400).json(errors);
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    //User Matched
                    const payload = { id: user.id, name: user.name, avatar: user.avatar }
                    //Sign token
                    jwt.sign(
                        payload,
                        keys.secretKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        })

                } else {
                    errors.password = "Password incorrect!!"
                    return res.status(400).json(errors);
                }
            })
    })
})

//@route GET api/users/current
// @desc Return current user
// @access private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})
module.exports = router;