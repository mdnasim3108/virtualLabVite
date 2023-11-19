import {
  AppstoreOutlined,
  BookOutlined,
  CheckSquareFilled,
  CheckSquareOutlined,
  CodeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Space, Typography, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faChalkboardUser, faMarker, faCode } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import userContext from "../../contextStore/context";
import { Cookies } from "react-cookie";
const SideMenu = (props) => {
  const navigate = useNavigate();
  const cookies = new Cookies()
  const { keys, setKeys, progress, selected, selectedProgressId } = useContext(userContext)
  console.log(progress)
  console.log(selected)

  const items = [
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
      key: `/editor/${selectedProgressId ? selectedProgressId : "12345"}`,
      icon: <FontAwesomeIcon icon={faCode} />,
    },
  ];
  return (  
    <div className="h-[calc(100vh-50px)] flex flex-col justify-between relative">
      <Menu
        items={props.items}
        onClick={(item) => {
          setKeys([item.key])
          navigate(item.key)
        }}
        className="w-[15rem] h-full border-r-[3rem] pt-5 "
        theme="dark"
        selectedKeys={keys}
      >
      </Menu>
      <Button icon={<LogoutOutlined />} onClick={() => {
        cookies.remove("user")
        navigate("/")
      }}
        className="absolute bottom-5 right-[30%] text-white"          
      >Logout</Button>
    </div>
  );
};
export default SideMenu;
