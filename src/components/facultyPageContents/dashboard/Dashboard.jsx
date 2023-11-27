import Welcome from "./welcome"
import ProfileData from "./profileData"
import Announcements from "./announcements"
import { useContext } from "react"
import userContext from "../../../contextStore/context"
import { Spin } from "antd"
const Dashboard = () => {
    const { user } = useContext(userContext)
    return <Spin spinning={user === undefined || user === null}>
        <div className="w-full h-full bg-[#f0f2f5]">
            <div className="flex justify-around w-full py-2 px-10">
                <Welcome />
                <ProfileData />
            </div>
            <div className="flex justify-around w-[70%] py-2 px-10">
                <Announcements />
            </div>
        </div>
    </Spin>
}
export default Dashboard