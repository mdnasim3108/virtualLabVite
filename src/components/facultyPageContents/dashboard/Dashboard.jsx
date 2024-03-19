import Welcome from "./welcome";
import ProfileData from "./profileData";
import Announcements from "./announcements";
import { useContext } from "react";
import userContext from "../../../contextStore/context";
import { Spin } from "antd";
import AvailableLabs from "../AvailableLabs/AvailableLabs";
import AddLab from "./AddLab";
const Dashboard = () => {
  const { user } = useContext(userContext);
  return (
    <Spin spinning={user === undefined || user === null}>
      <div className="w-full h-screen px-10 pt-5 ">
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col w-[60%] h-full justify-between">
            <Welcome />
            <AvailableLabs />
          </div>

          <div className=" w-[30%] h-full">
            <ProfileData />
            <AddLab/>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default Dashboard;
