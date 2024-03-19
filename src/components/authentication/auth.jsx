import Login from "./login";
import loginImg from "../../assets/loginCartoon.png";
import SignUp from "./signUp";
import { useState, useEffect } from "react";
import gctLogo from "../../assets/Government_College_of_Technology,_Coimbatore_logo.png";
import vlabImg from "../../assets/vlab.png";
import { Player } from "@lottiefiles/react-lottie-player";
import codeLottie from "../../assets/codeLottie.json";
import ForgotForm from "./forgotForm";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input,Spin } from "antd";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { api } from "../../constants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useContext } from "react";
import userContext from "../../contextStore/context";
const Auth = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(userContext);
  const toastifySuccess = () => {
    toast.success("Successfully SignedIn !!", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const toastifyFailure = () => {
    toast.error("Something went wrong!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [formData, setData] = useState({
    fName: "",
    lName: "",
    Email: "",
    Password: "",
    key: "",
  });
  const changeHandler = (e) => {
    setData({ ...formData, [e.target.id]: e.target.value });
  };
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    if (cookies.get("user") && user) {
      if (user.userRole == "student") navigate("/studentDashboard");
      else navigate("/facultyDashboard");
    }
  }, [user]);
  const [showLog, setShowLog] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const auth = getAuth();
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { fName, lName, Email, Password, key } = formData;
      console.log(import.meta.env);
      if (key !== import.meta.env.VITE_SECRET_KEY) {
        setShowInvalid(true);
        return;
      }
      setLoading(true);
      // const userCredentials = await createUserWithEmailAndPassword(
      //   auth,
      //   Email,
      //   Password
      // );
      console.log(userCredentials);
      const response = await axios.post(`${api}/auth/local/register`, {
        name: fName + " " + lName,
        username: fName + " " + lName,
        email: Email,
        password: Password,
        userRole: "Faculty",
      });
      setData({
        fName: "",
        lName: "",
        Email: "",
        Password: "",
        key: "",
      });
      setShowLog(true);
      setShowInvalid(false);
      handleCancel();
      setLoading(false);
      toastifySuccess();
    } catch (error) {
      setLoading(false);
      toastifyFailure();
      console.log(error);
    }
  };

  const addModalContent = (
    <form>
      <div>
        <label>First Name</label>
        <Input
          placeholder="Enter Your First Name"
          id="fName"
          onChange={changeHandler}
          required={true}
          value={formData.fName}
        />
      </div>

      <div className="mt-3">
        <label>Last Name</label>
        <Input
          placeholder="Enter Your Last Name"
          id="lName"
          onChange={changeHandler}
          value={formData.lName}
          required
        />
      </div>
      <div className="mt-3">
        <label>Email</label>
        <Input
          placeholder="Enter Your Email"
          id="Email"
          onChange={changeHandler}
          value={formData.Email}
          required
        />
      </div>
      <div className="mt-3">
        <label>Password</label>
        <Input
          placeholder="Enter Your Password"
          id="Password"
          onChange={changeHandler}
          type="password"
          value={formData.Password}
          required
        />
      </div>
      <div className="mt-3">
        <label>Secret Key</label>
        <Input
          placeholder="Enter the Secret Key"
          id="key"
          onChange={changeHandler}
          type="password"
          value={formData.key}
          required
        />
      </div>

      {showInvalid && (
        <p className="text-red-500 text-sm ">The secret key is Invalid</p>
      )}

      <div className="mt-5 w-full text-center">
        <button
          disabled={loading}
          className={` ${
            loading
              ? "bg-gray-300 text-white"
              : "hover:bg-violet-700 border border-violet-700 hover:text-white"
          }  transition-all duration-300 ease-in-out  font-medium rounded-lg text-sm w-[8rem] py-2 me-2 mb-2 focus:outline-none`}
          onClick={onSubmit}
        >
          {loading ? "Signing Up.." : "Sign Up"}
        </button>
      </div>
    </form>
  );
  return !cookies.get("user") ? (
    <>
      <ToastContainer />
      <Modal
        title={<p className="text-center">Register as Faculty</p>}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        {addModalContent}
      </Modal>
      <div className="authContainer w-full lg:h-screen">
      <div className=" flex justify-between items-center lg:flex-row flex-col   py-7 lg:pl-20 w-full lg:h-[20vh] lg:pr-[15rem] ">
      <div className="flex items-center justify-center">
            <img src={gctLogo} className="lg:w-[5rem] w-[3rem]  mr-3 " />
            <p className="lg:text-2xl text-lg  font-roboto">
              GCT Virtual Programming Laboratory
            </p>
          </div>
          <div className="w-[14rem] h-[2.5rem] lg:w-[18rem] lg:h-[3rem] lg:mt-0 mt-7 rounded-[30px] flex justify-between bg-violet-700 items-center px-[2px] relative">
            <button
              className={`text-white font-bold rounded-[30px] h-[90%] w-[50%]`}
              onClick={() => setShowLog(true)}
            >
              Login
            </button>
            <button
              className={` text-white font-bold rounded-[30px] w-[50%] h-[90%]`}
              onClick={() => setShowLog(false)}
            >
              Register{" "}
            </button>
            <button
              className={`bg-white transition-all ease-in-out duration-[400ms] text-violet-600 font-bold rounded-[30px] w-[50%] h-[90%] absolute ${
                !showLog ? "translate-x-[96.5%]" : ""
              }`}
            >
              {showLog ? "Login" : "Register"}
            </button>
          </div>
        </div>
        <div className="flex justify-between lg:flex-row flex-col-reverse lg:items-start items-center  lg:px-[3rem] px-[1rem]  w-full lg:h-[80vh] ">
          <div className=" lg:w-[50%] w-full  lg:h-[90%] relative bottom-5">
            {/* <img src={loginImg} className="logCartImg w-[2rem] h-[2rem]" alt =""/> */}
            <Player
              autoplay
              loop
              src={codeLottie}
              className="lg:w-[30rem] lg:h-[30rem] w-[70%] h-[20rem]   scale-x-[-1]"
            ></Player>
          </div>
          {showForgot ? (
            <ForgotForm
              sent={() => setShowForgot(false)}
              back={() => setShowForgot(false)}
            />
          ) : showLog ? (
            <Login
              forgot={() => {
                setShowForgot(true);
              }}
              login={(email) => props.login(email)}
            />
          ) : (
            <SignUp click={showModal} showlogin={() => setShowLog(true)} />
          )}
        </div>
      </div>
    </>
  ) : (
    <div className="w-full flex justify-center items-center h-screen ">
      <Spin tip="Loading" size="large">
        <div className="content p-[50px] rounded-[5px]" />
      </Spin>
    </div>
  );
};
export default Auth;
