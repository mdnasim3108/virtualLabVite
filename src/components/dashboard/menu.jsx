import {
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import userContext from "../../contextStore/context";
import { Cookies } from "react-cookie";
const SideMenu = (props) => {
  const navigate = useNavigate();
  const cookies = new Cookies()
  const { keys, setKeys,resetProcess } = useContext(userContext)

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
        resetProcess()
        cookies.remove("user")
        navigate("/")
      }}
        className="absolute bottom-5 right-[30%] text-white"          
      >Logout</Button>
    </div>
  );
};
export default SideMenu;
