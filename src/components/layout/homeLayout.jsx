import Header from "../dashboard/header";
import SideMenu from "../dashboard/menu";
import { Space } from "antd";
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
import { faUsers, faChalkboardUser, faMarker, faCode } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import userContext from "../../contextStore/context";
const HomeLayout = (props) => {
  const { user, selectedProgressId,selected } = useContext(userContext)
  const studentItems=[
    { label: "Dashboard", key: "/dashboard", icon: <AppstoreOutlined /> },
    { label: "Experiments", key: "/experiments", icon: <CodeOutlined /> },
    {
      label: "Submissions",
      key: "/submissions",
      icon: <CheckSquareOutlined />,
    },
    // {label:"courses",key:"/courses",icon:<BookOutlined/>},
    { label: "profile", key: "/profile", icon: <UserOutlined /> },
    {
      label: "classMates",
      key: "/classMates",
      icon: <FontAwesomeIcon icon={faUsers} />,
    },
    {
      label: "Teachers",
      key: "/teachers",
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
  const teacherItems=[
    { label: "Dashboard", key: "/dashboard", icon: <AppstoreOutlined /> },
    // { label: "teacherinfo", key: "/teacherDash", icon: <CodeOutlined /> },
    {
      label: "Students",
      key: "/students",
      icon: <CheckSquareOutlined />,
    },
    // {label:"courses",key:"/courses",icon:<BookOutlined/>},
    { label: "Experiments", key: "/teacherExperiments", icon: <UserOutlined /> },
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
    // {
    //   label: "Grades",
    //   key: "/grades",
    //   icon: <FontAwesomeIcon icon={faMarker} />,
    // },
    // {
    //   label: "Editor",
    //   key: "/editor/12345",
    //   icon: <FontAwesomeIcon icon={faCode} />,
    // },
  ];
  return user?<PrivateRoute>
      <div className="flex  w-full h-[100vh]">
        <div className="flex flex-col">
          <Header />
        <SideMenu items={user?.userRole === "Faculty" ? teacherItems : studentItems} />
          {/* <SideMenu  items={teacherItems}/> */}
        </div>

        <div className="h-screen w-full">
          {props.children}
        </div>

      </div>
    </PrivateRoute>:<p>loading</p>

};
export default HomeLayout;
