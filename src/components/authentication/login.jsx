import { useState, useEffect } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import { Cookies } from "react-cookie";
import { MailOutlined } from "@ant-design/icons";
import { AiOutlineLock } from "react-icons/ai";
import userContext from "../../contextStore/context";
import { useContext } from "react";
import { api } from "../../constants";
const Login = (props) => {
  const { setUser, fetchUser } = useContext(userContext);
  const cookies = new Cookies();
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const [loading, setLoading] = useState(false);
  const toastifySuccess = () => {
    toast.success("Successfully LogedIn !", {
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

  const toastifyFailure = (msg) => {
    toast.error(msg, {
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

  const [formIvsValid, setFormIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passIsValid, setPassIsValid] = useState(true);

  const formsubmitHandler = async (e) => {
    e.preventDefault();
    if (window.outerWidth < 1024) {
      toastifyFailure(
        "Desktop Access Only,Please access the dashboard using a desktop Device."
      );
      return;
    }
    if (formIvsValid) {
      setLoading(true);
      const auth = getAuth();

      axios
        .post(`${api}/auth/local`, {
          identifier: email,
          password,
        })
        .then((response) => {
          toastifySuccess();
          cookies.set("user", email, {
            path: "/",
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          });
          fetchUser();
          setLoading(false);
          if(response.data.user.userRole=="student"){
            navigate("/studentDashboard");
          }
          else{
            navigate("/facultyDashboard");
          }
          console.log("User profile", response.data.user);
          console.log("User token", response.data.jwt);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    }
  };

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const formChange = (e) => {
    // console.log(e);
    if (e.target.id === "email") {
      setEmailIsValid(
        e.target.value.includes("@") && e.target.value.includes(".")
      );
    }
    if (e.target.id === "password") {
      setPassIsValid(e.target.value.length >= 6);
    }
    setFormData((previousState) => ({
      ...previousState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    setFormIsValid(emailIsValid && passIsValid);
  }, [emailIsValid, passIsValid]);
  return (
    <div className="logForm  lg:pr-[3rem] mt-8 lg:w-[50%] w-full">
      <h1 className="text-4xl font-bold">Welcome Back!</h1>
      <h3
        className="text-xl mt-[1rem] font-semibold mb-[3rem]"
        style={{ color: "darkgray" }}
      >
        Login to continue
      </h3>
      <form onSubmit={formsubmitHandler} autoComplete="off" className="">
        <MailOutlined className="absolute lg:ml-[2rem] ml-[1rem] mt-[1.2rem] text-lg text-gray-600" />
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={formChange}
          placeholder="Enter Your Email"
          className={`lg:pl-[4rem] pl-[2.8rem] lg:py-5 py-3 block  border-2   overflow-visible authip lg:w-[36.5rem] w-full border-violet-700 focus:border-green-500 ${
            emailIsValid ? "" : "focus:border-red-500"
          }`}
          style={{
            fontSize: "1.1rem",
          }}
          autoComplete="new-password"
          required
        />
        <p
          className="ml-4 text-red-500"
          style={{ visibility: emailIsValid ? "hidden" : "visible" }}
        >
          Enter a valid email
        </p>
        <AiOutlineLock className="absolute lg:ml-[2rem] ml-[1rem] lg:mt-[1.5rem] mt-[1rem] text-2xl text-gray-600" />
        <input
          id="password"
          type="password"
          name="new-password"
          value={password}
          onChange={formChange}
          placeholder="Enter Your Password"
          className={`lg:pl-[4rem] pl-[2.8rem] lg:py-5 py-3 block border-2  border-violet-700 focus:border-green-500 authip lg:w-[36.5rem] w-full ${
            passIsValid ? "" : "focus:border-red-500"
          }`}
          style={{
            fontSize: "1.1rem",
          }}
          required
        />
        <p
          className="ml-4 text-red-500"
          style={{ visibility: passIsValid ? "hidden" : "visible" }}
        >
          Password must be atleast 6 characters
        </p>
        <div className="logFormBottom mt-8 flex items-center">
          <button
            disabled={loading}
            className={`loginButton font-bold text-xl text-white lg:mr-[5rem] py-[1.5rem] lg:w-[15rem] w-[9rem] ${
              loading ? "bg-gray-400" : "bg-violet-500"
            } transition-all duration-300 ease-in-out`}
          >
            {loading ? (
              <p className="lg:text-xl text-sm">LOGGING IN</p>
            ) : (
              <p className="lg:text-xl text-sm">LOGIN</p>
            )}
          </button>
          <ToastContainer />
          <p
            className="fgPass text-lg  hover:text-violet-700 transition-all duration-150 ease-in-out cursor-pointer"
            onClick={props.forgot}
          >
            Forgot password?
          </p>
        </div>
      </form>
    </div>
  );
};
export default Login;
