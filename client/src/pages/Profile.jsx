import Header from "src/components/Header";
import { useParams } from "react-router-dom";
import Banner from "src/components/profile/Banner";
import ProfileFeed from "src/components/profile/ProfileFeed";

const Profile = () => {
  let { authorID } = useParams();

  return (
    <>
      <Header />
      <Banner authorID={authorID} />
      <ProfileFeed authorID={authorID} />
    </>
  );
};

export default Profile;
