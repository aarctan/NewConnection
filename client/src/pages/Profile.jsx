import Header from "src/components/Header";
import { useParams } from "react-router-dom";
import Banner from "src/components/profile/Banner";

const Profile = () => {
  let { authorID } = useParams();

  return (
    <>
      <Header />
      <Banner authorID={authorID} />
    </>
  );
};

export default Profile;
