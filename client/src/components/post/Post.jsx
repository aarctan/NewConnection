import { useState, useContext, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Stack,
  CardActions,
  CardContent,
  Typography,
  CardMedia,
  Paper,
  InputBase,
  Divider,
  Avatar,
  Link,
} from "@mui/material";
import Comment from "src/components/post/Comment";
import PostModal from "src/components/post/PostModal";
import IconButton from "@mui/material/IconButton";
import LikeButtonIcon from "@mui/icons-material/FavoriteBorder";
import LikedIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PublicIcon from "@mui/icons-material/Public";
import FriendsIcon from "@mui/icons-material/People";
//import UnlistedIcon from "@mui/icons-material/InsertLink";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import CredentialsContext from "src/store/credentials-context";

import MenuModal from "src/components/post/MenuModal";
import DeletePostModal from "src/components/post/DeletePostModal";
import SharePostModal from "src/components/post/SharePostModal";
import LikesModal from "./LikesModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    textAlign: "center",
  },
}));

// https://stackoverflow.com/a/8888498
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const Post = (props) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [likedPost, setLikedPost] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const getCredentialsHandler = useContext(CredentialsContext);

  const currDate = new Date();
  const postDate = new Date(props.published);
  const days_ago = Math.floor((currDate - postDate) / 86400000);
  let days_ago_text = `${days_ago} days ago`;
  if (days_ago === 0) {
    days_ago_text = "today";
  } else if (days_ago === 1) {
    days_ago_text = "yesterday";
  }
  const posted_time = formatAMPM(postDate);

  const notify = (author) =>
    toast.success(`Comment sent to ${author}'s inbox!`);

  // If the post is public, add the comment to the posts comments
  const sendPublicComment = async (e) => {
    try {
      let credentials = getCredentialsHandler(props.author.host);
      const postResponse = await fetch(`${props.id}/comments/`, {
        method: "POST",
        body: JSON.stringify({
          author: authCtx.userdata,
          comment: comment,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ` + btoa(credentials),
        },
      });
      if (postResponse.ok) {
        const comment = await postResponse.json();
        setComments([comment, ...comments]);
        setComment("");
      } else {
      }
    } catch (error) {
      let errorMessage = "Send Comment failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  // Comments on friends posts go to the friends inbox
  const sendPrivateComment = async (e) => {
    try {
      let date = new Date();
      date = date.toISOString();
      let credentials = getCredentialsHandler(props.author.host);
      const postResponse = await fetch(`${props.author.id}/inbox/`, {
        method: "POST",
        body: JSON.stringify({
          type: "comment",
          author: authCtx.userdata,
          comment: comment,
          contentType: "text/plain",
          published: date,
          id: props.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ` + btoa(credentials),
        },
      });
      if (postResponse.ok) {
        notify(props.author.displayName);
      } else {
      }
    } catch (error) {
      let errorMessage = "Send Comment failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  const onLikePost = async (e) => {
    if (likedPost) {
      return;
    }
    try {
      let credentials = getCredentialsHandler(props.author.host);
      const postResponse = await fetch(`${props.author.id}/inbox/`, {
        method: "POST",
        body: JSON.stringify({
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Like",
          summary: `${authCtx.userdata.displayName} likes your post`,
          author: authCtx.userdata,
          object: props.id,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ` + btoa(credentials),
        },
      });
      if (postResponse.ok) {
        setLikedPost(true);
        fetchLikes();
      }
    } catch (error) {
      let errorMessage = "Send Like To Inbox failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  // Get comments for the post
  const fetchComments = useCallback(async () => {
    let credentials = getCredentialsHandler(props.author.host);
    const response = await fetch(`${props.id}/comments/`, {
      headers: {
        Authorization: `Basic ` + btoa(credentials),
      },
    });
    if (response.ok) {
      const commentData = await response.json();
      setComments(commentData["comments"]);
    } else {
      console.log("Post useEffect failed - fetching comments");
    }
  }, [props.id, props.author.host, getCredentialsHandler]);

  const fetchLikes = useCallback(async () => {
    let credentials = getCredentialsHandler(props.author.host);
    const response = await fetch(`${props.id}/likes/`, {
      headers: {
        Authorization: `Basic ` + btoa(credentials),
      },
    });
    if (response.ok) {
      const likeData = await response.json();
      setLikes(likeData);
      // see if the user liked this post
      for (let i = 0; i < likeData.length; i++) {
        if (likeData[i].author.id === authCtx.userdata.id) {
          setLikedPost(true);
          break;
        }
      }
    } else {
      console.log("Post useEffect failed - fetching comments");
    }
  }, [props.id, authCtx.userdata.id, props.author.host, getCredentialsHandler]);

  const openLikesModal = () => {
    setIsLikesModalOpen(true);
  };

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  useEffect(() => {
    setComments([]);
    fetchComments();
    fetchLikes();
  }, [fetchComments, fetchLikes]);

  // Determine if this is the post of the author who is logged in
  let isAuthor = false;
  if (props.author.id === authCtx.userdata.id) {
    isAuthor = true;
  }

  return (
    <Card elevation={3} sx={{ my: "10pt", backgroundColor: "#fafafa" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            alt="author"
            src={props.author.profileImage}
            sx={{
              width: 38,
              height: 38,
              marginRight: 2,
              border: 1,
              borderColor: "gray",
            }}
            onClick={() => {
              const words = props.author.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: props.author });
            }}
            style={{ cursor: "pointer" }}
          />
          <Stack direction="column" spacing={0}>
            <Typography variant="body1" color="text.primary" fontWeight="600">
              {props.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="10pt">
              {props.description}
            </Typography>
          </Stack>
        </Box>
        <IconButton aria-label="settings" onClick={() => setIsMenuOpen(true)}>
          <MoreHorizIcon />
        </IconButton>
      </CardContent>
      <CardActions
        className={classes.root}
        disableSpacing
        sx={{ paddingBottom: "0px" }}
      ></CardActions>
      {props.contentType === "text/markdown" && (
        <CardContent className={classes.root} sx={{ ml: 1 }}>
          <ReactMarkdown children={props.content} remarkPlugins={[remarkGfm]} />
        </CardContent>
      )}
      {props.contentType === "text/plain" &&
      props.content.slice(0, 4) === "http" ? (
        <CardContent className={classes.root} sx={{ padding: 0 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CardMedia
              component="img"
              style={{
                maxHeight: 500,
                maxWidth: "100%",
                width: "auto",
              }}
              image={props.content}
              alt="selfie"
            />
          </div>
        </CardContent>
      ) : (
        props.contentType === "text/plain" && (
          <CardContent className={classes.root}>
            <Typography variant="body1" color="text.primary">
              {props.content}
            </Typography>
          </CardContent>
        )
      )}
      {props.contentType.includes("base64") && (
        <CardContent className={classes.root} sx={{ padding: 0 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CardMedia
              component="img"
              style={{
                maxHeight: 500,
                maxWidth: "100%",
                width: "auto",
              }}
              image={props.content}
              alt="selfie"
            />
          </div>
        </CardContent>
      )}
      <CardActions
        className={classes.root}
        disableSpacing
        sx={{ paddingBottom: "5px", pt: 0 }}
      >
        <IconButton aria-label="like" onClick={onLikePost}>
          {likedPost ? (
            <LikedIcon style={{ fill: "#ED4857" }} />
          ) : (
            <LikeButtonIcon />
          )}
        </IconButton>
        <IconButton onClick={openShareModal} aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <CardContent
        sx={{ py: "0px", paddingBottom: 0 }}
        className={classes.root}
      >
        <Link component="button" underline="hover" onClick={openLikesModal}>
          <Typography
            variant="body2"
            color="text.primary"
            fontWeight="600"
            sx={{ paddingBottom: 0.5 }}
          >
            {likes.length} {likes.length === 1 ? "like" : "likes"}
          </Typography>
        </Link>

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Link
            component="button"
            variant="body2"
            color="text.secondary"
            fontWeight="600"
            underline="hover"
            onClick={() => setIsModalOpen(true)}
            sx={{ marginTop: 0.5 }}
          >
            View all comments
          </Link>
        </Box>
      </CardContent>
      {/* Comments */}
      <CardContent className={classes.root} sx={{ pt: 1, pb: 0.5 }}>
        {comments.slice(0, 2).map((comment, idx) => (
          <Comment
            key={idx}
            author={comment.author}
            comment={comment.comment}
          />
        ))}
      </CardContent>
      <CardContent
        className={classes.root}
        sx={{
          pt: 0,
          pb: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Stack display="flex" direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" color="text.secondary" fontSize="9pt">
            {props.post.origin === props.post.id ? "Posted " : "Shared "}
            {days_ago_text} by
          </Typography>
          <Link
            component="button"
            color="text.secondary"
            variant="body2"
            fontSize="9pt"
            underline="hover"
            onClick={() => {
              const words = props.author.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: props.author });
            }}
          >
            {props.author.displayName}
          </Link>
          <Typography variant="body2" color="text.secondary" fontSize="9pt">
            at {posted_time}
          </Typography>
          <FiberManualRecordIcon sx={{ color: "#646464", fontSize: "4pt" }} />
          {props.visibility === "PUBLIC" && (
            <PublicIcon sx={{ color: "#646464", fontSize: "10pt" }} />
          )}
          {props.visibility === "FRIENDS" && (
            <FriendsIcon sx={{ color: "#646464", fontSize: "10pt" }} />
          )}
        </Stack>
      </CardContent>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <InputBase
          value={comment}
          sx={{ ml: 1, flex: 1 }}
          placeholder="Comment..."
          inputProps={{ "aria-label": "comment" }}
          onChange={(e) => {
            e.preventDefault();
            setComment(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (props.visibility === "FRIENDS") sendPrivateComment();
              else sendPublicComment();
            }
          }}
        />
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          progressClassName="toastProgress"
          bodyClassName="toastBody"
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="send"
          onClick={
            props.visibility === "FRIENDS"
              ? sendPrivateComment
              : sendPublicComment
          }
        >
          <SendIcon />
        </IconButton>
      </Paper>
      {/* Opens the likes in a modal to view all likes */}
      <LikesModal
        isModalOpen={isLikesModalOpen}
        setIsModalOpen={setIsLikesModalOpen}
        likes={likes}
      ></LikesModal>
      {/* Opens the post in a modal to view all comments */}
      <PostModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        post={props}
        comments={comments}
      />
      <SharePostModal
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        post={props.post}
      />
      {/* If the author is a user, open these modals */}
      {isAuthor && (
        <>
          <MenuModal
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
          />
          <DeletePostModal
            isDeleteModalOpen={isDeleteModalOpen}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            post={props}
            handleRemove={props.handleRemove}
          />
        </>
      )}
    </Card>
  );
};

export default Post;
