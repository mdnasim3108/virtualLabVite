import Welcome from "./welcome";
import ProfileData from "./profileData";
import Announcements from "./announcements";
import { useContext } from "react";
import userContext from "../../../contextStore/context";
import { Spin, Calendar, theme } from "antd";
const StudentDashboard = () => {
  const { user, announcements } = useContext(userContext);
  const { token } = theme.useToken();
  console.log(announcements);
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <Spin spinning={user === undefined || user === null}>
      <div className="w-full h-screen grid grid-cols-2    pl-10 bg-[#e0e2e6]">
        {/* <div className="flex justify-around w-full py-2 px-10">
          <Welcome />
          <ProfileData />
        </div>
        <div className="flex  items-center justify-between w-full pl-20 pr-[8%]">
          
          <div style={wrapperStyle} className="w-full">
            <Calendar fullscreen={false} className="w-full" />
          </div>
          <Announcements />
        </div> */}
        <Welcome />
        <ProfileData />
        <Announcements />
        <div style={wrapperStyle} className="w-full left-[20%] relative">
          <Calendar fullscreen={false} className="w-full" />
        </div>
      </div>
    </Spin>
  );
};
export default StudentDashboard;
