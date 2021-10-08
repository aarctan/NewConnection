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
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  buttonContainer: {
    textAlign: "center",
  },
}));

/*
  Posts takes in these props:
  likes: String
  name: String
  content: String
  avatarUrl: String
*/
const Post = (props) => {
  const classes = useStyles();

  return (
    <Card sx={{ my: "25px" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body1" color="text.primary" fontWeight="600">
          {props.title}
        </Typography>
        <IconButton aria-label="settings">
          <MoreHorizIcon />
        </IconButton>
      </CardContent>
      {props.contentType === "text/plain" && (
        <CardContent className={classes.root}>
          <Typography variant="body2" color="text.secondary">
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
        sx={{ paddingBottom: "0px" }}
      >
        <IconButton aria-label="add to favorites">
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="comment">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
      <CardContent
        sx={{ py: "0px", paddingBottom: "8px" }}
        className={classes.root}
      >
        <Typography
          variant="body2"
          color="text.primary"
          fontWeight="600"
          sx={{ paddingBottom: 0.5 }}
        >
          {props.likes} likes
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography
            sx={{ paddingBottom: 0.5, marginRight: 1 }}
            variant="body2"
            color="text.primary"
            fontWeight="600"
          >
            {props.displayName}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            {props.description}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight="600">
          View all {props.count} comments
        </Typography>
      </CardContent>
      <form>
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
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton color="primary" sx={{ p: "10px" }} aria-label="send">
            <SendIcon />
          </IconButton>
        </Paper>
      </form>
    </Card>
  );
};

export default Post;
