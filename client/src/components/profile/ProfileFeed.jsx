import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Post from "src/components/post/Post";
import CircularProgress from "@mui/material/CircularProgress";
import GithubEvent from "../post/GithubEvent";

const supportedGithubEvents = new Set();
supportedGithubEvents.add("PushEvent");

const ProfileFeed = (props) => {
  const [posts, setPosts] = useState([]);
  const [githubEvents, setGithubEvents] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  useEffect(() => {
    setPosts([]);
    setPostsLoading(true);

    const github_name = props.author.github;
    if (github_name) {
      fetch(`https://api.github.com/users/${props.author.github}/events`)
        .then((response) => response.json())
        .then((data) => {
          setGithubEvents(
            data.filter((event) => supportedGithubEvents.has(event.type)).slice(0,5)
          );
        })
        .catch((err) =>
          console.log(
            `Could not retrieve github data for ${props.author.github}`
          )
        );
    }
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
      })
      .catch((error) => {
        console.log("NOT FOUND");
        setPostsLoading(false);
      })
      .catch((error) => console.log("ProfileFeed useEffect", error));

    setPostsLoading(false);
  }, [props.author]);

  return (
    <Box display="flex" flexDirection="column">
      {postsLoading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : posts.concat(githubEvents).length ? (
        posts
          .concat(githubEvents)
          .sort((p1, p2) => {
            const d1 = new Date(
              "published" in p1 ? p1.published : p1.created_at
            );
            const d2 = new Date(
              "published" in p2 ? p2.published : p2.created_at
            );
            return d2 - d1;
          })
          .map((post, idx) =>
            "published" in post ? (
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
                visibility={post.visibility}
                count={idx}
                comments={[]}
                handleRemove={handleRemove}
              />
            ) : (
              <GithubEvent key={idx} event={post} />
            )
          )
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#858585", marginTop: "10%" }}
        >
          <i>No posts found</i>
        </Typography>
      )}
    </Box>
  );
};

export default ProfileFeed;
