import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Container,
  Divider,
} from "@mui/material";
import EditProfileModal from "src/components/profile/EditProfileModal";

const Banner = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt="60pt"
        mb="20pt"
      >
        <Avatar
          alt="Avatar"
          src={props.author.profileImage}
          sx={{
            width: 135,
            height: 135,
            border: 1,
            marginBottom: "3pt",
            borderColor: "gray",
          }}
        />
        <Typography variant="body1" fontSize="20pt">
          {props.author.displayName}
        </Typography>
        {props.editBoolean && (
          <>
            <Button
              style={{
                color: "black",
                marginTop: "3pt",
                border: "1pt solid #dbdbdb",
                height: "25pt",
              }}
              onClick={() => setIsModalOpen(true)}
            >
              Edit Profile
            </Button>
          </>
        )}
      </Box>

      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        sx={{ width: "100%" }}
      >
        <Typography variant="body2" fontSize="14pt">
          1 Post
        </Typography>
        <Typography variant="body2" fontSize="14pt">
          5 Followers
        </Typography>
        <Typography variant="body2" fontSize="14pt">
          1 Following
        </Typography>
      </Box>
      <Divider />
      <EditProfileModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      ></EditProfileModal>
    </Container>
  );
};

export default Banner;
