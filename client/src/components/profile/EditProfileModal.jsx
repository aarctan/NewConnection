import {
  Box,
  Button,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import SendIcon from "@mui/icons-material/Send";
import { useState, useContext } from "react";
import AuthContext from "src/store/auth-context";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  boxShadow: 20,
  p: 3,
  borderRadius: "8px",
};

// https://stackoverflow.com/a/69786705
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    paddingLeft: 0,
  },
  '& .MuiInputAdornment-root': {
    backgroundColor: "#dfdfdf",
    padding: '28px 14px',
    borderTopLeftRadius: theme.shape.borderRadius + 'px',
    borderBottomLeftRadius: theme.shape.borderRadius + 'px',
  },
}));

// This modal edits the user/author profile
// When the user clicks update profile, it navigates to the users profile page.
// This updates the local storage userdata and sends the new author object to the Profile page so that all of the posts
// on the users profile get updated accordingly.
const EditProfileModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => setIsModalOpen(false);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const userdata = authCtx.userdata;
  const [displayName, setDisplayName] = useState(userdata.displayName);
  const [github, setGithub] = useState(userdata.github);
  const [profileImage, setProfileImage] = useState(userdata.profileImage);
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("sm"));

  if (!isModalOpen) return null;

  const handleUpdate = async (e) => {
    const userdata = authCtx.userdata;
    try {
      const putResponse = await fetch(`${userdata.id}/`, {
        method: "POST",
        body: JSON.stringify({
          displayName: displayName,
          github: github,
          profileImage: profileImage,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${authCtx.token}`,
        },
      });
      if (putResponse.ok) {
        const putData = await putResponse.json();
        authCtx.update(putData);
        const words = putData.id.split("/");
        const word = words[words.length - 1];
        // Pass the new author to the profile page so that it updates properly
        navigate(`/app/author/${word}`, { state: putData });
        setIsModalOpen(false);
      } else {
      }
    } catch (error) {
      let errorMessage = "Profile update failed";
      console.log(error.message);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={style}
          style={
            small
              ? { width: "80%", height: "50%" }
              : { width: 400, height: 375 }
          }
        >
          <Box>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              align="center"
            >
              Edit Profile
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column">
            <TextField
              label="Display Name"
              fullWidth
              margin="dense"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
              }}
            />
            <StyledTextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">https://github.com/</InputAdornment>
                ),
              }}
              label="Github"
              fullWidth
              margin="dense"
              value={github}
              onChange={(e) => {
                setGithub(e.target.value);
              }}
            />
            <TextField
              label="Profile Picture"
              fullWidth
              margin="dense"
              value={profileImage}
              onChange={(e) => {
                setProfileImage(e.target.value);
              }}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              endIcon={<SendIcon />}
              onClick={handleUpdate}
              variant="contained"
              style={{
                color: "black",
                backgroundColor: "white",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
            >
              Update Profile
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default EditProfileModal;
