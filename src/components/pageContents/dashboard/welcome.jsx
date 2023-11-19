import { Space, Spin } from "antd"
import hat from "../../../assets/graduationHat.png"
import { useContext } from "react"
import userContext from "../../../contextStore/context"
const Welcome = () => {
    const { user } = useContext(userContext)
    console.log(user)
    return user ? <div className="w-[55%]  h-[30vh] border rounded-lg px-10 py-7 flex flex-col justify-between shadow z-10 bg-gradient-to-r from-[#064dff] via-[#0c67ff] to-[#0c67ff] relative">
        <p className="text-[#9bc1ff] text-sm">April 30 ,Tuesday</p>
        <Space direction="vertical">
            <h1 className="text-white text-3xl font-bold tracking-wide">Welcome back,{user.username.split(" ")[0]}</h1>
            <p className="text-white text-[16px]">you've finished 85% of your goal!</p>
        </Space>
        <img src={hat} className="w-[13rem] absolute right-[2rem] top-0 scale-x-[-1]" />
    </div> :
        <Spin spinning={user === undefined} />
}
export default Welcome