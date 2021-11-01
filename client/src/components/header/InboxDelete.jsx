import { Box } from "@mui/material";
import { useContext } from "react";
import AuthContext from "src/store/auth-context";

const InboxDelete = ({ setInbox }) => {
  const authCtx = useContext(AuthContext);

  // Clears the users inbox
  const clearInbox = async (e) => {
    try {
      const response = await fetch(`${authCtx.userdata.id}/inbox/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setInbox([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        height: 40,
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: "#eeeeee",
        color: "black",
        alignItems: "center",
        py: 0,
      }}
      onClick={clearInbox}
    >
      Clear Inbox
    </Box>
  );
};

export default InboxDelete;
