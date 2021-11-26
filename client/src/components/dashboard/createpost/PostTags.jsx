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
    <Box display="flex" flexDirection="row" width="100%">
      <Autocomplete
        multiple
        fullWidth
        id="tags"
        options={[]}
        freeSolo
        value={props.categories}
        onChange={(e, newTag) => {
          props.setCategories(newTag);
        }}
        renderTags={(value, getTagProps) =>
          value.map((tag, index) => (
            <StyledChip key={index} label={tag} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            margin="dense"
            label="Tags"
            placeholder="Add a tag..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target.value) {
                props.setCategories((prevTags) => [
                  ...prevTags,
                  e.target.value,
                ]);
              }
            }}
          />
        )}
      />
    </Box>
  );
};

export default PostTags;
