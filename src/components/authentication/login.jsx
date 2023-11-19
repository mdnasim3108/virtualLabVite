import { useState, Fragment, useEffect } from "react";
import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import google from "../../assets/googleIcon.jpg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import axios from "axios";
import { Cookies} from "react-cookie";
import { MailOutlined } from "@ant-design/icons";
import { AiOutlineLock } from "react-icons/ai";
import userContext from "../../contextStore/context";
import { useContext } from "react";
const Login = (props) => {
  const { setUser,fetchUser } = useContext(userContext);
  const cookies=new Cookies();
  var today = new Date();
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
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

  const toastifyFailure = () => {
    toast.error("Invail Email or Password !", {
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

    if (formIvsValid) {
      const auth = getAuth();

      await signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          toastifySuccess();
          // setCookie("user", email, { path: "/", expires: tomorrow });
          cookies.set('user',email, {path: '/', expires: new Date(Date.now()+(2 * 24 * 60 * 60 * 1000))})
          const res = await axios.get(
            `http://localhost:1337/api/users?filters[email][$eqi]=${email}&populate=*`
          );
          console.log(res.data);
          fetchUser()
          // setUser(res.data[0]);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log(error);
          toastifyFailure();
        });
    }
  };


  const navigate = useNavigate();
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user.photoURL);

        localStorage.setItem("email", result.user.email);
        // props.login()
      })
      .catch(() => {
        toastifyFailure();
      });
  };



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
      <div className="logForm  pr-[3rem] mt-8 lg:w-[50%] w-full">
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
        <h3
          className="text-xl mt-[1rem] font-semibold mb-[3rem]"
          style={{ color: "darkgray" }}
        >
          Login to continue
        </h3>
        <form onSubmit={formsubmitHandler} autoComplete="off" className="">
          <MailOutlined className="absolute ml-[2rem] mt-[1.2rem] text-lg text-gray-600" />
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={formChange}
            placeholder="Enter Your Email"
            className={`pl-[4rem] py-5 block  border-2   overflow-visible authip w-[36.5rem] border-violet-700 focus:border-green-500 ${
              emailIsValid ? "" : "focus:border-red-500"
            }`}
            style={{
              fontSize: "1.1rem",
            }}
            autocomplete="new-password"
          />
          <p
            className="ml-4 text-red-500"
            style={{ visibility: emailIsValid ? "hidden" : "visible" }}
          >
            Enter a valid email
          </p>
          <AiOutlineLock className="absolute ml-[2rem] mt-[1.5rem] text-2xl text-gray-600" />
          <input
            id="password"
            type="password"
            name="new-password"
            value={password}
            onChange={formChange}
            placeholder="Enter Your Password"
            className={`pl-[4rem] py-5 block border-2  border-violet-700 focus:border-green-500 authip w-[36.5rem] ${
              passIsValid ? "" : "focus:border-red-500"
            }`}
            style={{
              fontSize: "1.1rem",
            }}
          />
          <p
            className="ml-4 text-red-500"
            style={{ visibility: passIsValid ? "hidden" : "visible" }}
          >
            Password must be atleast 6 characters
          </p>
          <div className="logFormBottom mt-8 flex">
            <button
              className="loginButton font-bold text-xl text-white mr-[5rem]"
              
            >
              LOGIN
            </button>
            <ToastContainer />
            <p
              className="fgPass text-lg mt-[1.6rem] hover:text-violet-700 transition-all duration-150 ease-in-out cursor-pointer"
              onClick={props.forgot}
            >
              Forgot password?
            </p>
          </div>
        </form>
        <div className="altLogin mt-[4rem] w-[35rem] flex">
          {/* <div className="w-[17rem] h-[4rem] bg-blue-500 cursor-pointer relative bottom-2.5 flex py-[1rem] pr-[1rem] pl-[1rem] rounded" onClick={googleLogin}>
              <img alt ="" src={google} className="w-[2rem] h-[2rem]"/>
              <p className="text-white text-lg ml-[1rem]">Sign in with google</p>
          </div> */}
        </div>
      </div>
  );
};
export default Login;
