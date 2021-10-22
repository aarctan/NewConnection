import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import EditProfileModal from "src/components/editprofile/EditProfileModal";

const Banner = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Box display="flex" mx="30%" mt="85px" mb="45px">
        <Avatar
          alt="Avatar"
          src={props.author.profileImage}
          sx={{
            width: 135,
            height: 135,
            marginRight: 12,
            border: 1,
            borderColor: "gray",
          }}
        />
        <Box>
          <Box display="flex" alignItems="flex-start">
            <Typography variant="body1" fontSize="20pt">
              {props.author.displayName}
            </Typography>
            {props.editBoolean && (
              <>
                <Button
                  style={{
                    color: "black",
                    marginLeft: "20pt",
                    marginTop: "3pt",
                    border: "1pt solid #dbdbdb",
                    height: "25pt",
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  Edit Profile
                </Button>
                <IconButton
                  color="inherit"
                  size="small"
                  sx={{ ml: 2, marginTop: "2pt" }}
                >
                  <SettingsIcon />
                </IconButton>
              </>
            )}
          </Box>

          <Box
            display="flex"
            alignItems="flex-start"
            sx={{ marginTop: "15pt" }}
          >
            <Typography variant="body2" fontSize="14pt">
              1 post
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mx: "30%" }} />
      <EditProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></EditProfileModal>
    </>
  );
};

export default Banner;