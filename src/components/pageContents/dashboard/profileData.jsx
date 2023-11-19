import bgImg from "../../../assets/profileBg.jpeg"
import userImg from "../../../assets/acc1.png"
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Popover, Card, Spin } from "antd"
import { useContext } from "react";
import userContext from "../../../contextStore/context";
const ProfileData = () => {
    const navigate = useNavigate()
    const { setKeys, user } = useContext(userContext)
    const cover = user ? <div className="relative">
        <img src={bgImg} className="w-full h-[11rem]" />
        <div className="flex flex-col justify-center items-center absolute top-[0.5rem] left-[4.2rem]">
            <img src={userImg} className="w-[6rem]" />
            <p className="text-xl font-bold text-white mt-1">{user.username}</p>
            <p className="text-sm  text-white mt-1">{user.email}</p>
        </div>
        <Popover content={<p className="text-sm">Edit Profile</p>} placement="rightTop">
            <div className="absolute top-3 right-3 rounded-full w-[2rem] h-[2rem] flex items-center justify-center bg-white border cursor-pointer hover:bg-gray-100 transition-all duration-200 ease-in-out" onClick={() => {
                setKeys(["/profile"])
                navigate("/profile")

            }}>
                <FontAwesomeIcon icon={faPencil} className="w-[1rem]" />
            </div>
        </Popover>
    </div> : <Spin spinning={user === undefined} />
    const userData = [
        { key: "Roll no", value: user?.roll },
        { key: "Course", value: "B.tech IT" },
        { key: "Batch", value: "2020-2024" },
        { key: "Semester", value: "VI" },
    ]

    return user ? <div>
        <Card cover={cover} style={{
            width: 300,
        }}>
            <div className="flex flex-col">
                {userData.map((user) => <div className="flex justify-between">
                    <p className="text-lg font-semibold text-gray-800">{user.key}</p>
                    <p className="text-lg text-gray-500">{user.value}</p>
                </div>)}
            </div>
        </Card>
    </div> :
        <Spin spinning={user === undefined} />
}
export default ProfileData;