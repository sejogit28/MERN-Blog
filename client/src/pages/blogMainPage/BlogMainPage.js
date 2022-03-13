import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Pagination,
  Divider,
  Segment,
  Placeholder,
} from "semantic-ui-react";

import BlogPostService from "../../Services/BlogPostService";
import BlogCard from "./components/BlogMainPageCard";

const BlogMainPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    BlogPostService.getBlogPostPagi(pageNumber).then(
      ({ bPosts, totalBlogPages }) => {
        console.log(bPosts);
        setBlogPosts(bPosts);
        setNumberOfPages(totalBlogPages);
        setLoaded(true);
      }
    );
  }, [pageNumber]);

  const onPagiChange = (e, pageInfo) => {
    setPageNumber(pageInfo.activePage);
  };

  const PlaceHolderComponent = () => {
    return (
      <Grid.Column>
        <Segment raised>
          <Placeholder>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="medium" />
              <Placeholder.Line length="short" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Segment>
      </Grid.Column>
    );
  };

  return loaded ? (
    <Grid container columns="equal">
      <Grid.Row centered>
        <h1>Welcome to Coding Mind!</h1>
      </Grid.Row>
      <Grid.Row>
        <Pagination
          onPageChange={onPagiChange}
          activePage={pageNumber}
          totalPages={numberOfPages}
        />
      </Grid.Row>
      <Grid.Row>
        <Card.Group centered itemsPerRow={2}>
          {blogPosts.map((blogpost) => {
            return (
              <React.Fragment key={blogpost._id}>
                <BlogCard fluidTrue={true} blogpost={blogpost} />

                <Divider></Divider>
              </React.Fragment>
            );
          })}
        </Card.Group>
      </Grid.Row>
      <Grid.Row>
        <Pagination
          onPageChange={onPagiChange}
          activePage={pageNumber}
          totalP2ages={numberOfPages}
        />
      </Grid.Row>
    </Grid>
  ) : (
    <Grid columns={2} stackable>
      <PlaceHolderComponent />
      <PlaceHolderComponent />
      <PlaceHolderComponent />
      <PlaceHolderComponent />
      <PlaceHolderComponent />
      <PlaceHolderComponent />
    </Grid>
  );
};

export default BlogMainPage;
