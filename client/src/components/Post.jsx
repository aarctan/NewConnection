import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
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
      <CardHeader
        className={classes.root}
        avatar={
          <Avatar
            alt="Chad"
            src={props.pfpUrl}
            sx={{ width: 38, height: 38 }}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
        titleTypographyProps={{ variant: "h6" }}
        title={props.name}
      />
      <CardMedia
        component="img"
        height="600"
        image={props.contentUrl}
        alt="selfie"
      />
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
        <Typography variant="body2" color="text.primary" fontWeight="600">
          {props.likes} likes
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
