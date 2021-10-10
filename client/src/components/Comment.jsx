import { Box, Typography, Link } from "@mui/material";
//import IconButton from "@mui/material/IconButton";
//import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Comment = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fafafa",
        py: 0.2,
      }}
    >
      <Link
        component="button"
        variant="body2"
        color="text.primary"
        fontWeight="600"
        underline="hover"
        sx={{ marginRight: 1 }}
      >
        {props.user}
      </Link>
      <Typography variant="body2">{props.comment}</Typography>
    </Box>
  );
};

export default Comment;
