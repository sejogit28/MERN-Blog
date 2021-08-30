const express = require('express')
const router = express.Router();
let blogPosts = require('../blogModels/blogPostsModel');
const upload = require('../utils/multer');
const cloudinary = require("../utils/cloudinary");


router.get('/blogList',(req, res) =>
{
    blogPosts.find()
    .then(posts => res.json(posts))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/blogPagi', async (req, res) =>{
    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0") - 1;
    const total = await blogPosts.countDocuments({});
    const bPosts = await blogPosts.find({})
    .limit(PAGE_SIZE)
    .skip(PAGE_SIZE * page).sort({"createdAt": -1});
    res.json({
        totalBlogPages: Math.ceil(total / PAGE_SIZE),
        bPosts,
    });
});

router.get('/:id',(req, res) => {
    blogPosts.findById(req.params.id)
    .then(singleBlogPost => res.json(singleBlogPost))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', upload.single('blogImage'), async (req, res)=>
{
    try 
    {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);

        const newblogPost = new blogPosts(
            {
                title: req.body.title,
                author:req.body.author,
                summary: req.body.summary,
                body: req.body.body,
                readTime: req.body.readTime,
                imageUrl:  uploadResult.secure_url,
                cloudinaryId:  uploadResult.public_id,
                tags: req.body.tags
            })
    
        newblogPost.save()
        .then(() => res.json({message: {msgBody : "New Post Posted successfully!", msgError: false}}))
        .catch(err => res.status(400))

    }     

    catch (err) 
    {
        console.log(err);

    }
});


router.put('/updatePic/:postId', upload.single('blogImage'), async (req, res)=>
{
    try
    {

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
    
        blogPosts.findById(req.params.postId)
        .then(async bPost => 
        {
            bPost.cloudinaryId && await cloudinary.uploader.destroy(bPost.cloudinaryId);
            bPost.imageUrl = uploadResult.secure_url;
            bPost.cloudinaryId = uploadResult.public_id;
            bPost.title = bPost.title,
            bPost.author = bPost.author,
            bPost.summary = bPost.summary,
            bPost.body = bPost.body,
            bPost.readTime = bPost.readTime,

            bPost.tags = bPost.tags
    
            bPost.save()
            .then(() => res.json({message: {msgBody : "Post pic ppdatedsuccessfully!", msgError: false}}))
            .catch(err => res.status(400).json('Error: ' + err));
        })
            .catch(err => res.status(400).json('Error: ' + err));
    }
    catch(err)
    {
        console.log(err);
    }
       

});

router.put('/updateNoPic/:postId',  (req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
            bPost.title = req.body.title,
            bPost.author = req.body.author,
            bPost.summary = req.body.summary,
            bPost.body = req.body.body,
            bPost.readTime = req.body.readTime,
            bPost.imageUrl = bPost.imageUrl,
            bPost.tags = req.body.tags

            bPost.save()
            
        .then(() => res.json({message: {msgBody : "Post updated successfully!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
       

});

router.delete('/delete/:postId', (req, res)=> {
    blogPosts.findByIdAndDelete(req.params.postId)
    .then(async deletedBlogPost => 
    
        {
            await cloudinary.uploader.destroy(deletedBlogPost.cloudinaryId);
            res.json({message: {msgBody : "Post Deleted Sucessfully", msgError: false}})
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:postId/addcomm',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
           const username = req.body.username;
           const postfinder = req.params.postId;
           const commBody = req.body.commBody;
           const parentcommfinder = req.body.parentcommfinder;
           const posterImageUrl = req.body.posterImageUrl;

           bPost.comments.push({
               //The variable names must match the model names(Its case senstive)
               username,
               postfinder,
               commBody,
               parentcommfinder,
               posterImageUrl
           })

            bPost.save()
        .then(() => res.json({message: {msgBody : "Comment added successfully!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:postId/replyToComm/:commId',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
    {
        /*The variable names(username vs userName example) are case sensitve and must match
         what you called them in the model */
        const username = req.body.username;
        const postfinder = req.params.postId;
        const commBody = req.body.commBody;
        const parentcommfinder = req.params.commId;
        const posterImageUrl = req.body.posterImageUrl;

        bPost.comments.push(
        {
            //The variable names must match the model names(Its case senstive)
            username,
            postfinder,
            commBody,
            parentcommfinder,
            posterImageUrl
        })

            bPost.save()
        .then(() => res.json({message: {msgBody : "Reply comment added successfuly!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:postId/updateComm/:commId',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
            var currComm  = bPost.comments.find(o => o._id == req.params.commId);        
            currComm.commBody = req.body.commBody;     

        bPost.save()
        .then(() => res.json({message: {msgBody : "Comment Updated successfully!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.put('/update/:postId/deletecomm/:commId', async (req, res)=>
{
    await blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
            bPost.comments  = bPost.comments.filter(o => o._id != req.params.commId)            //bPost.comments.slice(deletedCommIndex);
        

        bPost.save()
        .then(() => res.json({message: {msgBody : "Comment deleted successfully!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
        

module.exports = router;