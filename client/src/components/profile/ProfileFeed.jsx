import { useState, useEffect, useCallback, useContext } from "react";
import { Box, Typography } from "@mui/material";
import Post from "src/components/post/Post";
import CircularProgress from "@mui/material/CircularProgress";
import GithubEvent from "../post/GithubEvent";
import CredentialsContext from "src/store/credentials-context";
import AuthContext from "src/store/auth-context";

const supportedGithubEvents = new Set();
supportedGithubEvents.add("PushEvent");
supportedGithubEvents.add("IssuesEvent");

const ProfileFeed = (props) => {
  const [posts, setPosts] = useState([]);
  const [githubEvents, setGithubEvents] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const getCredentialsHandler = useContext(CredentialsContext);
  const authCtx = useContext(AuthContext);

  // https://www.robinwieruch.de/react-remove-item-from-list
  const handleRemove = (id) => {
    const newList = posts.filter((post) => post.id !== id);
    setPosts(newList);
  };

  const fetchFeed = useCallback(async () => {
    setPosts([]);
    setPostsLoading(true);

    if (props.author.github) {
      const github_name = props.author.github.substring(
        props.author.github.lastIndexOf("/") + 1
      );
      try {
        const githubResponse = await fetch(
          `https://api.github.com/users/${github_name}/events`
        );
        const githubData = await githubResponse.json();

        setGithubEvents(
          githubData
            .filter((event) => supportedGithubEvents.has(event.type))
            .slice(0, 5)
        );
      } catch (error) {
        console.log(`Could not retrieve github data for ${github_name}`);
      }
    }

    try {
      // Get the inbox of the logged in user
      let credentials = getCredentialsHandler(authCtx.userdata.host);
      const response = await fetch(`${authCtx.userdata.id}/inbox/`, {
        headers: { Authorization: `Basic ` + btoa(credentials) },
      });
      if (response.ok) {
        let inboxData = await response.json();
        inboxData = inboxData["items"];
        console.log(inboxData);
        for (let j = 0; j < inboxData.length; j++) {
          if (
            inboxData[j].type.toLowerCase() === "post" &&
            inboxData[j].author.id === props.author.id
          ) {
            setPosts((oldArray) => [...oldArray, inboxData[j]]);
          }
        }
      }
      // Get the credentials of the authors page we are viewing
      credentials = getCredentialsHandler(props.author.host);
      let url = `${props.author.id}/posts/`;
      const postsResponse = await fetch(url, {
        headers: {
          Authorization: `Basic ` + btoa(credentials),
        },
      });
      const postsData = await postsResponse.json();
      for (let j = 0; j < postsData.length; j++) {
        if (postsData[j].categories == null) postsData[j].categories = []; // check if categories is null to avoid an uniterable error
        setPosts((oldArray) => [...oldArray, postsData[j]]);
      }
    } catch (error) {
      console.log("NOT FOUND");
      setPostsLoading(false);
    }

    setPostsLoading(false);
  }, [props.author, authCtx.userdata, getCredentialsHandler]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchFeed();
  }, [fetchFeed]);

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
                post={post}
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
