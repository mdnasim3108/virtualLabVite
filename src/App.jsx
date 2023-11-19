import Auth from "./components/authentication/auth";
import { BrowserRouter as Router ,Routes,Route } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";
import { Helmet } from "react-helmet";
import "./App.css";
import Home from "./components/home/Home";
import { ToastContainer } from "react-toastify";
import { useState,useContext } from "react";
import userContext from "./contextStore/context";
import axios from "axios";
const  App =  ()=>{
  const {setUser}=useContext(userContext)
  const [showHome,setShowHome]=useState(false)
  const [loading,setLoading]=useState(false)
  const loginHandler=async(email)=>{
    const res=await axios.get(`http://localhost:1337/api/users?filters[email][$eqi]=${email}&populate=*`)
    console.log(res.data)
    setUser(res.data[0])
    setShowHome(true)
  }
  return (
      <div className="w-full h-full">
        <Router>
        <ToastContainer/>
        <Helmet>
        <title>Virtual Lab</title>
      </Helmet>
        {/* <Router>
            <Routes>
                <Route path="/" element={<Auth/>} />
                <Route path="/home" element={<Home/>} />    
            </Routes>
        </Router> */}
        {
          showHome?<Home logout={()=>setShowHome(false)} />:<Auth login={loginHandler} loading={loading} />
        }
        </Router>
      </div>
   
  );
}

export default App;

