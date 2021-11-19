import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Post from "src/components/post/Post";
import CircularProgress from "@mui/material/CircularProgress";

const ProfileFeed = (props) => {
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  useEffect(() => {
    setPosts([]);
    setPostsLoading(true);
    console.log(props.author.id);
    fetch(`${props.author.id}/posts/`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (
          props.author.host === "https://cmput404-vgt-socialdist.herokuapp.com/"
        ) {
          for (let j = 0; j < data.items.length; j++) {
            setPosts((oldArray) => [...oldArray, data.items[j]]);
          }
        } else {
          for (let j = 0; j < data.length; j++) {
            setPosts((oldArray) => [...oldArray, data[j]]);
          }
        }

        setPostsLoading(false);
      })
      .catch((error) => {
        console.log("NOT FOUND");
        setPostsLoading(false);
      })

      .catch((error) => console.log("ProfileFeed useEffect", error));
  }, [props.author.id, props.author.host]);

  return (
    <Box display="flex" flexDirection="column">
      {postsLoading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : posts.length ? (
        posts.map((post, idx) => (
          <Post
            key={idx}
            id={post.id}
            title={post.title}
            description={post.description}
            author={props.author}
            contentType={post.contentType}
            content={post.content}
            published={post.published}
            categories={post.categories}
            count={idx}
            comments={[]}
            handleRemove={handleRemove}
          />
        ))
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#858585", marginTop: "10%" }}
        >
          <i>Looks like you have no posts. Why not try creating one!</i>
        </Typography>
      )}
    </Box>
  );
};

export default ProfileFeed;
