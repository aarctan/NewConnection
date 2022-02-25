import { Box, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const InboxPostItem = (props) => {
  console.log(props.item);
  let item = props.item;
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        py: 0,
      }}
      onClick={() => {
        const author_array = item.author.id.split("/");
        let author_id;
        author_id = author_array[author_array.length - 1];
        const post_array = item.id.split("/");
        const post_id = post_array[post_array.length - 1];
        navigate(`/app/author/${author_id}/post/${post_id}`, { state: item }); // state contains the post
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="Avatar"
          src={item.author.profileImage}
          sx={{
            width: 17,
            height: 17,
            marginRight: 1,
            cursor: "pointer",
            border: 1,
            borderColor: "gray",
          }}
          onClick={() => {
            const words = item.author.id.split("/");
            const word = words[words.length - 1];
            navigate(`/app/author/${word}`, { state: item.author });
          }}
        />
        <Typography variant="body2">
          <b>{item.author.displayName}</b> created a post
        </Typography>
      </Box>
    </Box>
  );
};

export default InboxPostItem;
