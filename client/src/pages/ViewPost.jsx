import Header from "src/components/header/Header";
import { useLocation, Navigate } from "react-router-dom";
import { Container } from "@mui/material";
import Post from "src/components/post/Post";
// This page allows the user to view a specific post of a specified user

const ViewPost = () => {
  const { state } = useLocation(); // State will be a post object
  const post = state;

  return (
    <>
      <Header />
      {post ? (
        <Container maxWidth="sm" sx={{ paddingTop: "50pt", px: 0 }}>
          <Post
            post={post}
            id={post.id}
            title={post.title}
            description={post.description}
            author={post.author}
            contentType={post.contentType}
            content={post.content}
            published={post.published}
            categories={post.categories}
            visibility={post.visibility}
            count={post.count}
            likes={[]}
          />
        </Container>
      ) : (
        <Navigate to="/404" replace={true} />
      )}
    </>
  );
};

export default ViewPost;
