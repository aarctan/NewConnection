import { useState, useContext, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  Box,
  CardActions,
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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";
import AuthContext from "src/store/auth-context";
import MenuModal from "src/components/post/MenuModal";
import DeletePostModal from "src/components/post/DeletePostModal";
import LikesModal from "./LikesModal";

const API_URL = process.env.REACT_APP_API_URL;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    textAlign: "center",
  },
}));

const Post = (props) => {
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [likedPost, setLikedPost] = useState(false);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const onSendComment = async (e) => {
    try {
      const userdata_url = authCtx.userdata.id.split("/");
      const author_id = userdata_url[userdata_url.length - 1];
      const post_url = props.id.split("/");
      const post_id = post_url[post_url.length - 1];
      const postResponse = await fetch(
        `${API_URL}/author/${author_id}/posts/${post_id}/comments/`,
        {
          method: "POST",
          body: JSON.stringify({
            author: authCtx.userdata,
            comment: comment,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (postResponse.ok) {
        const comment = await postResponse.json();
        setComments([comment, ...comments]);
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
      const postResponse = await fetch(`${props.author.id}/inbox/`, {
        method: "POST",
        body: JSON.stringify({
          type: "Like",
          summary: `${authCtx.userdata.displayName} likes your post`,
          actor: authCtx.userdata,
          object: props.id,
        }),
        headers: {
          "Content-Type": "application/json",
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
    const response = await fetch(`${props.id}/comments/`);
    if (response.ok) {
      const commentData = await response.json();
      setComments(commentData["comments"]);
    } else {
      console.log("Post useEffect failed - fetching comments");
    }
  }, [props.id]);

  const fetchLikes = useCallback(async () => {
    const response = await fetch(`${props.id}/likes/`);
    if (response.ok) {
      const likeData = await response.json();
      console.log(likeData);
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
  }, [props.id, authCtx.userdata.id]);

  const openLikesModal = () => {
    setIsLikesModalOpen(true);
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
    <Card elevation={3} sx={{ my: "25px" }}>
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
          <Typography variant="body1" color="text.primary" fontWeight="600">
            {props.title}
          </Typography>
        </Box>
        <IconButton aria-label="settings" onClick={() => setIsMenuOpen(true)}>
          <MoreHorizIcon />
        </IconButton>
      </CardContent>
      {props.contentType === "text/plain" && (
        <CardContent className={classes.root}>
          <Typography variant="body1" color="text.primary">
            {props.content}
          </Typography>
        </CardContent>
      )}
      {props.contentType === "image/png;base64" && (
        <CardContent className={classes.root} sx={{ padding: 0 }}>
          <CardMedia
            component="img"
            height="600"
            image={props.content}
            alt="selfie"
          />
        </CardContent>
      )}
      <CardActions
        className={classes.root}
        disableSpacing
        sx={{ paddingBottom: "5px" }}
      >
        <IconButton aria-label="like" onClick={onLikePost}>
          {likedPost ? (
            <LikedIcon style={{ fill: "#ED4857" }} />
          ) : (
            <LikeButtonIcon />
          )}
        </IconButton>
        <IconButton aria-label="comment">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton aria-label="share">
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
            underline="hover"
            fontWeight="600"
            sx={{ marginRight: 1 }}
            onClick={() => {
              const words = props.author.id.split("/");
              const word = words[words.length - 1];
              navigate(`/app/author/${word}`, { state: props.author });
            }}
          >
            {props.author.displayName}
          </Link>
          <Typography variant="body2" color="text.secondary" fontSize="10pt">
            {props.description}
          </Typography>
        </Box>
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
      </CardContent>
      {/* Comments */}
      <CardContent className={classes.root} sx={{ py: 0.5 }}>
        {comments.slice(0, 2).map((comment, idx) => (
          <Comment
            key={idx}
            author={comment.author}
            comment={comment.comment}
          />
        ))}
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
          sx={{ ml: 1, flex: 1 }}
          placeholder="Comment..."
          inputProps={{ "aria-label": "comment" }}
          onChange={(e) => {
            setComment(e.target.value);
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          color="primary"
          sx={{ p: "10px" }}
          aria-label="send"
          onClick={onSendComment}
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
