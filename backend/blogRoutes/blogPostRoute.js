const express = require('express')
const router = express.Router();
let blogPosts = require('../blogModels/blogPostsModel');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (request, file, callback){
        callback(null, 'C:/Users/Sean/Desktop/React/mern-blog/client/public/BlogPostImages');
    },
    filename: function(request, file, callback){
        callback(null, Date.now() + file.originalname);
    },
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*3
    },
})

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
    .then(exercise => res.json(exercise))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/add', upload.single('blogImage'), (req, res)=>
{
    console.log(req.file);

        const newblogPost = new blogPosts(
            {
                title: req.body.title,
                author:req.body.author,
                summary: req.body.summary,
                body: req.body.body,
                readTime: req.body.readTime,
                imageUrl: req.file.filename,
                tags: req.body.tags
            })

        newblogPost.save()
        .then(() => res.json({message: {msgBody : "New Post Posted Bro!", msgError: false}}))
        .catch(err => res.status(400))
});


router.put('/update/:postId', upload.single('blogImage'), (req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
            bPost.title = req.body.title,
                bPost.author = req.body.author,
                bPost.summary = req.body.summary,
                bPost.body = req.body.body,
                bPost.readTime = req.body.readTime,
                bPost.imageUrl = req.file.filename,
                bPost.tags = req.body.tags

                 bPost.save()
        .then(() => res.json({message: {msgBody : "Post Updated Bro!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
       

});

router.delete('/delete/:postId', (req, res)=> {
    blogPosts.findByIdAndDelete(req.params.postId)
    .then(() => res.json({message: {msgBody : "Post Deleted Bro!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:postId/addcomm',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
           const userName = req.body.userName;
           const postfinder = req.params.postId;
           const commBody = req.body.commBody;
           const parentcommfinder = req.body.parentcommfinder;
            const posterImageUrl = req.body.posterImageUrl;

           bPost.comments.push({
               //The variable names must match the model names(Its case senstive)
               userName,
               postfinder,
               commBody,
               parentcommfinder,
               posterImageUrl
           })

            bPost.save()
        .then(() => res.json({message: {msgBody : "Comment added Bro!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:postId/replyToComm/:commId',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
           const userName = req.body.userName;
           const postfinder = req.params.postId;
           const commBody = req.body.commBody;
           const parentcommfinder = req.params.commId;
            const posterImageUrl = req.body.posterImageUrl;

           bPost.comments.push({
               //The variable names must match the model names(Its case senstive)
               userName,
               postfinder,
               commBody,
               parentcommfinder,
               posterImageUrl
           })

            bPost.save()
        .then(() => res.json({message: {msgBody : "Reply comment added Bro!", msgError: false}}))
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
        .then(() => res.json({message: {msgBody : "Comment Updated Bro!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


router.put('/update/:postId/deleteComm/:commId',(req, res)=>
{
    blogPosts.findById(req.params.postId)
    .then(bPost => 
        {
            bPost.comments  = bPost.comments.filter(o => o._id != req.params.commId)            //bPost.comments.slice(deletedCommIndex);
        

        bPost.save()
        .then(() => res.json({message: {msgBody : "Comment deleted Bro!", msgError: false}}))
        .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});
        

module.exports = router;