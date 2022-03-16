import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Input,
  Button,
  Placeholder,
  Dropdown,
} from "semantic-ui-react";

import tagOptions from "../components/TagOptions";
import BlogPostService from "../../Services/BlogPostService";
import BlogCard from "../components/BlogArticleCard";

const BlogSearchPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    BlogPostService.getBlogPosts().then((data) => {
      console.log(data);
      setBlogPosts(data);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    setFilteredPosts(
      blogPosts.filter((post) => {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, blogPosts]);

  const returnAllPosts = () => {
    BlogPostService.getBlogPosts().then((data) => {
      console.log(data);
      setBlogPosts(data);
    });
  };

  const filterByTag = (tagName) => {
    setFilteredPosts(
      blogPosts.filter((tagPost) => {
        /* For every blogPost, filter it out if its tags Array doesn't include the tagName */
        const filteredTags = tagPost.tags.includes(tagName);
        console.log(filteredTags);
        return filteredTags;
      })
    );
  };

  const PlaceHolderCard = () => {
    return (
      <Card>
        <Placeholder>
          <Placeholder.Image square />
        </Placeholder>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="very short" />
              <Placeholder.Line length="medium" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="short" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
        <Card.Content extra>
          <Button disabled color="black">
            Read More
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return loaded ? (
    <Grid container columns="equal">
      <Grid.Row>
        <Grid.Column>
          <h1>Search</h1>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column computer={5} mobile={12}>
          <Dropdown
            text="Filter"
            icon="filter"
            floating
            labeled
            button
            className="icon"
            scrolling
          >
            <Dropdown.Menu>
              <Dropdown.Header icon="tags" content="Filter by tag" />
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => returnAllPosts()}>
                Un-filter
              </Dropdown.Item>
              {tagOptions.map((tag) => {
                return (
                  <Dropdown.Item key={tag} onClick={() => filterByTag(tag)}>
                    {tag}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column computer={4} mobile={12}>
          <Input
            fluid
            icon="search"
            placeholder="Search by title..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid
        padded="horizontally"
        columns={3}
        container
        style={{ paddingLeft: "0", paddingRight: "0" }}
      >
        {filteredPosts.reverse().map((blogpost) => {
          return (
            <>
              <Grid.Column
                key={blogpost._id}
                computer={5}
                tablet={8}
                mobile={16}
              >
                <BlogCard key={blogpost._id} blogpost={blogpost} />
              </Grid.Column>
            </>
          );
        })}
      </Grid>
    </Grid>
  ) : (
    <Card.Group doubling itemsPerRow={3} stackable>
      <PlaceHolderCard />
      <PlaceHolderCard />
      <PlaceHolderCard />
    </Card.Group>
  );
};

export default BlogSearchPage;
