import Header from "../dashboard/header";
import SideMenu from "../dashboard/menu";
import { Space, Spin } from "antd";
import PrivateRoute from "../../privateRoute";

import {
  AppstoreOutlined,
  BookOutlined,
  CheckSquareFilled,
  CheckSquareOutlined,
  CodeOutlined,
  LogoutOutlined,
  UserOutlined,
  EllipsisOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import {
  faUsers,
  faChalkboardUser,
  faMarker,
  faCode,
} from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import userContext from "../../contextStore/context";
const HomeLayout = (props) => {
  const { user, selectedProgressId, selected } = useContext(userContext);
  const studentItems = [
    { label: "Dashboard", key: "/studentDashboard", icon: <AppstoreOutlined /> },
    { label: "Experiments", key: "/experiments", icon: <CodeOutlined /> },
    {
      label: "Submissions",
      key: "/submissions",
      icon: <CheckSquareOutlined />,
    },
    {
      label: "Faculties",
      key: "/faculties",
      icon: <FontAwesomeIcon icon={faChalkboardUser} />,
    },
    {
      label: "Grades",
      key: "/grades",
      icon: <FontAwesomeIcon icon={faMarker} />,
    },
    {
      label: "Editor",
      key: `/editor/${selected.no}`,
      icon: <FontAwesomeIcon icon={faCode} />,
    },
  ];
  const teacherItems = [
    { label: "Dashboard", key: "/facultyDashboard", icon: <AppstoreOutlined /> },
    // { label: "teacherinfo", key: "/teacherDash", icon: <CodeOutlined /> },
    {
      label: "Students",
      key: "/Students",
      icon: <CheckSquareOutlined />,
    },
    // {label:"courses",key:"/courses",icon:<BookOutlined/>},
    {
      label: "Experiments",
      key: "/teacherExperiments",
      icon: <UserOutlined />,
    },
    {
      label: "Submissions",
      key: "/experimentSubmissions",
      icon: <CheckSquareOutlined />,
    },
    {
      label: "Announcements",
      key: "/announcements",
      icon: <CheckSquareOutlined />,
    },
    // {
    //   label: "Message",
    //   key: "/teachers",
    //   icon: <WechatOutlined />,
    // },
    {
      label: "Grades",
      key: "/FacultyGradings",
      icon: <FontAwesomeIcon icon={faMarker} />,
    },
    // {
    //   label: "Editor",
    //   key: "/editor/12345",
    //   icon: <FontAwesomeIcon icon={faCode} />,
    // },
  ];
  return user ? (
    <PrivateRoute>
      <div className="flex  w-full h-[100vh]">
        <div className="flex flex-col">
          <Header />
          <SideMenu
            items={user?.userRole === "Faculty" ? teacherItems : studentItems}
          />
        </div>

        <div className="h-screen w-full">{props.children}</div>
      </div>
    </PrivateRoute>
  ) : (
    <div className="w-full flex justify-center items-center h-screen ">
      <Spin tip="Loading" size="large">
        <div className="content p-[50px] rounded-[5px]" />
      </Spin>
    </div>
  );
};
export default HomeLayout;
