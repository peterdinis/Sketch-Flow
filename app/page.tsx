import { NextPage } from "next";
import { Room } from "./_components/Room";
import { CollaborativeApp } from "./_components/CollaborativeApp";

const Homepage: NextPage = () => {
  return (
    <Room>
      <CollaborativeApp />
    </Room>
  )
}

export default Homepage;