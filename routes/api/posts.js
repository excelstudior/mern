const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');

//Load Post model
const Post=require('../../model/Post');
const Profile=require('../../model/Profile')
//Validatioin

const validatePostInput=require('../../validation/post')
//router.get('/test',(req,res)=>res.json({"msg":"Post works!!"}))

//@route POST api/posts
//@desc Create Post
//@access Private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            res.status(400).json(errors);
        }

        const newPost=new Post({
            text:req.body.text,
            name:req.body.name,
            avatar:req.body.avatar,
            user:req.user.id
        })
        newPost.save().then(post=>res.json(post));
})

//@route POST api/posts/like/:id
//@desc Like Post
//@access Private

router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(400).json({noprofile:"User profile doesn't exist"})
            }

            Post.findById(req.params.id)
            .then(post=>{
                if (!post){
                    return res.status(404).send("Post not found")
                }

                if(post.likes.filter(like=>like.user.toString()==req.user.id).length>0){
                    return res.status(400).json({alreadyLike :"User already liked this post"});
                }
                post.likes.push({user:req.user.id});
                post.save().then(post=>res.json(post)).catch(err=>res.status(404).json(err))
            })
        });

        
})
//@route POST api/posts/unlike/:id
//@desc Unlike Post
//@access Private

router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(400).json({noprofile:"User profile doesn't exist"})
            }

            Post.findById(req.params.id)
            .then(post=>{
                if (!post){
                    return res.status(404).send("Post not found")
                }

                if(post.likes.filter(like=>like.user.toString()==req.user.id).length==0){
                    return res.status(400).json({alreadyLike :"User doesn't like it this post"});
                }

                const removeIndex=post.likes
                .map(item=>item.user)
                .indexOf(req.user.id);
                post.likes.splice(removeIndex,1)
            
                post.save().then(post=>res.json(post)).catch(err=>res.status(404).json(err))
            })
        });

        
})

//@route POST api/posts/comments/:id
//@desc Comment Post
//@access Private

router.post('/comments/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const { errors, isValid } = validatePostInput(req.body);

        if (!isValid) {
            res.status(400).json(errors);
        }

    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(400).json({noprofile:"User profile doesn't exist"})
            }

            Post.findById(req.params.id)
            .then(post=>{
                if (!post){
                    return res.status(404).send("Post not found")
                }

                const newComment={
                    text:req.body.text,
                    name:req.body.name,
                    avatar:req.body.avatar,
                    user:req.user.id
                }
                post.comments.unshift(newComment);
                post.save().then(post=>res.json(post))
            }).catch(err=>res.status(404).json(err))
        });

        
})

//@route Delete api/posts/comments/:id
//@desc Comment Post
//@access Private

router.delete('/comments/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res)=>{

console.log("sdfadsf")
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(400).json({noprofile:"User profile doesn't exist"})
            }
            Post.findById(req.params.id)
            .then(post=>{
                if (!post){
                    return res.status(404).send("Post not found")
                }
                if((post.comments.filter(comment=>comment._id.toString()===req.params.comment_id))===0){
                    return res.status(404).json({commentNotExits:"Comment doesn't exist"});
                }
                const removeIndex=post.comments
                .map(item=>item._id.toString())
                .indexOf(req.params.comment_id);
                post.comments.splice(removeIndex,1);
                post.save().then(post=>res.json(post))
            }).catch(err=>res.status(404).json(err))
        });

        
})

//@route Delete api/posts:id
//@desc Delete Post
//@access Private

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
        Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                return res.status(400).json({noprofile:"User profile doesn't exist"})
            }

            Post.findById(req.params.id)
            .then(post=>{
                if (!post){
                    return res.status(404).send("Post not found")
                }

                if(post.user.toString()!==req.user.id){
                    return res.status(401).json({notauthorised :"User not authorised"});
                }
                post.remove().then(post=>res.json(post)).catch(err=>res.status(404).json(err))
            })
        });
})
//@route GET api/posts
//@desc Get Posts
//@access Public
router.get('/',(req,res)=>{
    Post.find().sort({date:-1})
    .then(posts=>{
        res.status(200).json(posts);
    })
    .catch(err=>res.status(400).json(err))
})

//@route GET api/posts/:id
//@desc Get a Post with id
//@access Public
router.get('/:id',(req,res)=>{
    Post.findById(req.params.id)
    .then(post=>{
        if(!post){
            res.status(404).json({nopost:'No Post found with that ID'})
        }
        res.status(200).json(post);
    })
    .catch(err=>res.status(400).json(err))
})

module.exports=router;