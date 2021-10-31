import { Box, Typography, Link, Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";

const Comment = (props) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fafafa",
        py: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          backgroundColor: "#fafafa",
          py: 0.2,
        }}
      >
        <Avatar
          alt="Avatar"
          src={props.author.profileImage}
          sx={{
            width: 17,
            height: 17,
            marginRight: 1,
            cursor: "pointer",
            border: 1,
            borderColor: "gray",
          }}
          onClick={() => {
            const words = props.author.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: props.author });
          }}
        />
        <Link
          component="button"
          variant="body2"
          color="text.primary"
          fontWeight="600"
          underline="hover"
          sx={{ marginRight: 1 }}
          onClick={() => {
            const words = props.author.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: props.author });
          }}
        >
          {props.author.displayName}
        </Link>
        <Typography variant="body2">{props.comment}</Typography>
      </Box>
      <IconButton aria-label="settings" sx={{ padding: 0.5 }}>
        <FavoriteBorderIcon sx={{ width: 20, height: 20 }} />
      </IconButton>
    </Box>
  );
};

export default Comment;
