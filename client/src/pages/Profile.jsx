import Header from "src/components/Header";
import { useParams, useLocation } from "react-router-dom";
import Banner from "src/components/profile/Banner";
import ProfileFeed from "src/components/profile/ProfileFeed";

const Profile = (props) => {
  let { authorID } = useParams();
  const { state } = useLocation();
  console.log(state);

  return (
    <>
      <Header />
      <Banner authorID={authorID} author={state} />
      <ProfileFeed authorID={authorID} />
    </>
  );
};

export default Profile;
