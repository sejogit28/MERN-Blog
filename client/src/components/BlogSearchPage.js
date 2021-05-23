import React, {useEffect, useState} from 'react';
import { Grid, Card, Input, Button } from 'semantic-ui-react';


import BlogPostService from '../Services/BlogPostService';
import BlogCard from './BlogMainPageCard';


const BlogSearchPage = () =>
{
    

    const [blogPosts, setBlogPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
//    const [searchType, setSearchType] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() =>{
        BlogPostService.getBlogPosts().then(data =>{
            console.log(data);
            setBlogPosts(data);
          

        });
    }, []);

    useEffect(() =>
    {
        setFilteredPosts(blogPosts.filter(post => 
        {
            return post.title.toLowerCase().includes(searchTerm.toLowerCase())
        }))
    }, [searchTerm, blogPosts])

   //return tagPost.tags.toLowerCase().includes(tagName.toLowerCase())
   const returnAllPosts = () => 
    {
        BlogPostService.getBlogPosts().then(data =>{
            console.log(data);
            setBlogPosts(data);
        })
    }

    const filterByTag = tagName =>
    {
        setFilteredPosts(blogPosts.filter(tagPost => 
            /* This need to be set filtered posts and not setBlogPosts in order to work the 
            right way...not all the way sure rn...*/
            {
                /*For every blogPost, filter it if its tags Array includes the tagName*/
                
                const filteredTags = tagPost.tags.includes(tagName);
                console.log(filteredTags)
                return filteredTags
            }))
    }

    
    

    return(
     <Grid container columns='equal'>
            <Grid.Row centered>
                <h1>Search</h1>
            </Grid.Row>

            <Grid.Row centered>
                 <Input icon='search' placeholder='Search by title...' onChange={e => setSearchTerm(e.target.value)} />
            </Grid.Row>
            <Grid.Row centered>
                <Button.Group>
                    <Button onClick={()=>{returnAllPosts()}}>All</Button>
                    <Button onClick={()=>filterByTag("Exercise")}>Exercise</Button>
                    <Button onClick={()=>filterByTag("Memory")}>Memory</Button>
                    <Button onClick={()=>filterByTag("Neuroplasticity")}>Neuroplasticity</Button>
                    <Button onClick={()=>filterByTag("Sleep")}>Sleep</Button>
                    <Button onClick={()=>filterByTag("Learning")}>Learning</Button>
                    <Button onClick={()=>filterByTag("Emotion")}>Emotion</Button>
                    <Button onClick={()=>filterByTag("Nutrition")}>Nutrition</Button>

                </Button.Group> 
            </Grid.Row>
            <Grid.Row>
            <Card.Group centered itemsPerRow={3}> 
            {
            filteredPosts.reverse().map(blogpost => 
            //.reverse() makes it so the most recently created post is displayed first
                {
                    return(
                        
                            
                            <BlogCard key={blogpost._id} blogpost={blogpost}/>
                        

                        
                    )
                })
            }
            </Card.Group>   
            </Grid.Row>
        </ Grid>
     )
        }   

export default BlogSearchPage;