import Header from "src/components/Header";
import { useParams, useLocation } from "react-router-dom";
import Banner from "src/components/profile/Banner";
import ProfileFeed from "src/components/profile/ProfileFeed";
import { Navigate } from "react-router-dom";

const Profile = () => {
  let { authorID } = useParams();
  const { state } = useLocation();

  return (
    <>
      <Header />
      {state ? (
        <>
          <Banner authorID={authorID} author={state} />
          <ProfileFeed authorID={authorID} />
        </>
      ) : (
        <Navigate to="/404" replace={true} />
      )}
    </>
  );
};

export default Profile;
