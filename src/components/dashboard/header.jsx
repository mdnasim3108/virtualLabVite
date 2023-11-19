import { Button, Image, Space, Typography } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import gctImg from "../../assets/Government_College_of_Technology,_Coimbatore_logo.png";
import profileImg from "../../assets/acc1.png";
import { Dropdown } from "antd";
import { useNavigate } from "react-router";
import userContext from "../../contextStore/context";
import { useContext, useEffect } from "react";
import { Cookies } from "react-cookie";
const Header = (props) => {
  const { user } = useContext(userContext)
  const cookies = new Cookies()
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: <Space>
        <UserOutlined />
        <p onClick={() => navigate("/profile")}>profile</p>
      </Space>
    },
    {
      key: "2",
      label: <Space>
        <LogoutOutlined className="text-red-800" />
        <p onClick={() => {
          cookies.remove("user")
          navigate("/")
        }}>logout</p>
      </Space>,
    },
  ];
  return (
    <div className="h-[50px] w-[15rem] flex justify-between items-center   ">
      <div className="w-full pl-4 h-full bg-black py-4">
        {/* <Image width={40} src={gctImg} /> */}
        <h1 className="text-xl font-semibold text-white">Virtual Laboratory</h1>
      </div>

      {/* <div className="w-[calc(100%-15rem)] pr-5 flex items-center justify-end h-full border-b border-b-[rgba(0,0,0,0.15)]">
        <div className="bg-white w-max rounded-full border shadow px-2 text-white cursor-pointer">
          <Dropdown menu={{ items }} className="w-max">
            <Space align="center">
              <Image width={30} src={profileImg} className="mt-2" />
              <div className="flex flex-col">
                <Typography.Text className="text-[15px] font-semibold">
                  {user.username.split(" ")[0]}
                </Typography.Text>
                <Typography.Text className="text-[14px] text-gray-400 relative bottom-1">
                  {user.role.name}
                </Typography.Text>
              </div>
              <DownOutlined style={{ color: "black" }} />
            </Space>
          </Dropdown>
        </div>
        <Button icon={<LogoutOutlined />} onClick={() => {
          cookies.remove("user")
          navigate("/")
        }}  >Logout</Button>
      </div> */}
    </div> 

  );
};
export default Header;
