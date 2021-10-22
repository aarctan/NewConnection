import Header from "src/components/Header";
import { useParams, useLocation, Navigate } from "react-router-dom";
import Banner from "src/components/profile/Banner";
import ProfileFeed from "src/components/profile/ProfileFeed";
import { useContext } from "react";
import AuthContext from "src/store/auth-context";

const Profile = () => {
  let { authorID } = useParams();
  const { state } = useLocation();
  const authCtx = useContext(AuthContext);

  let editBoolean = false;
  if (state.id === authCtx.userdata.id) {
    editBoolean = true;
  }

  return (
    <>
      <Header />
      {state ? (
        <>
          <Banner
            authorID={authorID}
            author={state}
            editBoolean={editBoolean}
          />
          <ProfileFeed authorID={authorID} author={state} />
        </>
      ) : (
        <Navigate to="/404" replace={true} />
      )}
    </>
  );
};

export default Profile;
