import { useState } from "react";
import { Chip, Stack, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const PostTags = (props) => {
  const [currentTag, setCurrentTag] = useState("");

  return (
    <>
      <TextField
        label={"Add a tag"}
        value={currentTag}
        variant="standard"
        margin="dense"
        onChange={(e) => {
          setCurrentTag(e.target.value);
        }}
        sx={{ width: "20%" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!props.tags.includes(currentTag)) {
              props.setTags((prevTags) => [...prevTags, currentTag]);
            }
            setCurrentTag("");
          }
        }}
      />
      <Stack direction="row" spacing={1}>
        <Stack alignItems="center" direction="row" spacing={1}>
          {props.tags.map((tag, idx) => {
            return (
              <Chip
                sx={{ width: "fit-content" }}
                key={idx}
                variant="outlined"
                label={`${tag}`}
                deleteIcon={<DeleteIcon />}
                onDelete={() => {}}
              />
            );
          })}
        </Stack>
      </Stack>
    </>
  );
};

export default PostTags;
