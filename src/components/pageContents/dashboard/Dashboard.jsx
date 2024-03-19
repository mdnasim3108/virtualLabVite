import Welcome from "./welcome";
import ProfileData from "./profileData";
import Announcements from "./announcements";
import { useContext } from "react";
import userContext from "../../../contextStore/context";
import { Spin, Calendar, theme } from "antd";
import StudentAvailableLabs from "./StudentAvailableLabs";
const StudentDashboard = () => {
  const { user, announcements } = useContext(userContext);
  const { token } = theme.useToken();
  console.log(announcements);
  return (
    <Spin spinning={user === undefined || user === null}>
      <div className="w-full h-screen px-10 pt-5 ">
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col w-[60%] h-full justify-between">
            <Welcome />
            <StudentAvailableLabs/>
            {/* <AvailableLabs /> */}
          </div>

          <div className=" w-[30%] h-full">
            <ProfileData />
            {/* <AddLab/> */}
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default StudentDashboard;
