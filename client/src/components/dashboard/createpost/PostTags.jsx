import { Chip, Box, TextField, Autocomplete } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledChip = styled(Chip)`
  & .MuiChip-deleteIcon {
    display: none;
  }

  :hover {
    & .MuiChip-deleteIcon {
      display: block;
    }
  }
`;

const PostTags = (props) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="baseline">
      <Autocomplete
        multiple
        fullWidth
        id="tags"
        options={[]}
        freeSolo
        value={props.tags}
        onChange={(e, newTag) => {
          props.setTags(newTag);
        }}
        renderTags={(value, getTagProps) =>
          value.map((tag, index) => (
            <StyledChip key={index} label={tag} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="Add a tag..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value) {
                props.setTags((prevTags) => [...prevTags, e.target.value]);
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default PostTags;
