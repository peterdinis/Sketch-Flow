import { NextPage } from "next";
import { Room } from "./_components/shared/Room";
import { CollaborativeApp } from "./_components/shared/CollaborativeApp";

const Homepage: NextPage = () => {
  return (
    <Room>
      <CollaborativeApp />
    </Room>
  )
}

export default Homepage;