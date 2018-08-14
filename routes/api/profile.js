const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
//Load Profile model
const Profile = require('../../model/Profile');
//const User = require('../../model/User');
const validateProfilenput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
router.get('/test', (req, res) => res.json({ "msg": "Profile works!!" }))

//@route GET api/profile
//@desc Get current users profile
//@access Private

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile
//@desc CREATE or EDIT current users profile
//@access Private

router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        //Errors
        const { errors, isValid } = validateProfilenput(req.body);

        if (!isValid) {
            res.status(400).json(errors);
        }

        //Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

        //Skills - Split into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }
        //Social
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                if (profile) {
                    Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    ).then(profile => res.json(profile));
                } else {
                    //create

                    //Check if handle exists
                    Profile.findOne({ handle: profileFields.handle }).then(profile => {
                        if (profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }
                        //Save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
                }
            })
    }
);

//@route Post api/profile/experience
//@desc  ADD experience to current users profile
//@access Private
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            const newExperience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                desciption: req.body.desciption
            }

            profile.experience.unshift(newExperience);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile/experience/:experience_id
//@desc  Update experience to current users profile
//@access Private
router.post('/experience/:experience_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            const updateIndex=profile.experience
            .map(item=>item.id)
            .indexOf(req.params.experience_id)

                profile.experience[updateIndex].title= req.body.title,
                profile.experience[updateIndex].company= req.body.company,
                profile.experience[updateIndex].location= req.body.location,
                profile.experience[updateIndex].from= req.body.from,
                profile.experience[updateIndex].to= req.body.to,
                profile.experience[updateIndex].current= req.body.current,
                profile.experience[updateIndex].desciption= req.body.desciption

            //profile.experience.unshift(newExperience);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile/education
//@desc  ADD education to current users profile
//@access Private
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                desciption: req.body.desciption
            }

            profile.education.unshift(newEducation);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(400).json(err));
});

//@route Post api/profile/education/:education_id
//@desc  Update education to current users profile
//@access Private
router.post('/education/:education_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    }
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            const updateIndex=profile.education
            .map(item=>item.id)
            .indexOf(req.params.education_id)

                profile.education[updateIndex].school= req.body.school,
                profile.education[updateIndex].degree= req.body.degree,
                profile.education[updateIndex].fieldofstudy= req.body.fieldofstudy,
                profile.education[updateIndex].from= req.body.from,
                profile.education[updateIndex].to= req.body.to,
                profile.education[updateIndex].current= req.body.current,
                profile.education[updateIndex].desciption= req.body.desciption

            //profile.education.unshift(neweducation);
            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});
//@route delete api/profile/experience
//@desc  delete experience of current users profile
//@access Private
router.delete('/experience/:experience_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors  = {};
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }

            const removeIndex=profile.experience
            .map(item=>item.id)
            .indexOf(req.params.experience_id);

            profile.experience.splice(removeIndex,1);

            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route delete api/profile/experience
//@desc  delete experience of current users profile
//@access Private
router.delete('/education/:education_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors  = {};
    // need to find a way to validate date time value, moment js
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }

            const removeIndex=profile.education
            .map(item=>item.id)
            .indexOf(req.params.education_id);

            profile.education.splice(removeIndex,1);

            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile/handle/:handle
//@desc  GET users profile with handle
//@access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile/user/:user_id
//@desc  GET users profile with user_id
//@access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

//@route Post api/profile/all
//@desc  GET all users profile
//@access Public
router.get('/all', (req, res) => {
    const errors = {};

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'No hace de file'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;