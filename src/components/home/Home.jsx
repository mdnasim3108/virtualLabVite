import Header from "../dashboard/header";
import SideMenu from "../dashboard/menu";
import Content from "../dashboard/content";
import { Space } from "antd";
import { useNavigate } from "react-router";
import { useEffect } from "react";
const Home=(props)=>{
    const navigate=useNavigate()
    useEffect(()=>{
        console.log("1")
        navigate("/dashboard")
    },[])
    return 
}
export default Home;