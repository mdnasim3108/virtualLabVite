import { Fragment, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./login.css";
import { AiFillEyeInvisible, AiFillEye, AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import { GrGroup } from "react-icons/gr";
import { api } from "../../constants";
import { DownOutlined } from "@ant-design/icons";
import nameIcon from "../../assets/iconName.png";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { faHashtag, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import {
  faUser,
  faLock,
  // faBuilding,
  faCheck,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { db } from "../../firebase-config";
import { doc, setDoc } from "firebase/firestore";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const SignUp = (props) => {
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
    toast.error("Email already in use !!", {
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

  const otpSuccess = () => {
    toast.success("Phone Number Verified!!", {
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

  const otpFailure = () => {
    toast.error("Please Check The OTP!!", {
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

  const phoneNumberSuccess = () => {
    toast.success("OTP Sent Successfully!!", {
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
  const phoneNumberError = () => {
    toast.error("Enter correct Phone Number!!", {
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmObj, setConfirmObj] = useState("");

  const numberHandler = (e) => {
    setValue(e.target.value);
  };
  const [isEqual, setIsEqual] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    roll: "",
    batch: "1",
  });

  const { firstName, lastName, email, password, confirmPassword, roll, batch } =
    formData;

  const formChange = (e) => {
    setFormData((previousState) => ({
      ...previousState,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    setIsEqual(password === confirmPassword);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmPassword]);

  const auth = getAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const response = await axios.post(`${api}/auth/local/register`, {
        name: firstName + " " + lastName,
        username: firstName + " " + lastName,
        email: email,
        password: password,
        roll,
        batch: +batch,
        userRole:"student"
      });
      toastifySuccess();
      
    } catch (error) {
      console.log(error);
      toastifyFailure();
    }
  };

  function setUpRecaptcha(value) {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifier.render();
    return signInWithPhoneNumber(auth, value, recaptchaVerifier);
  }
  const getOtp = async (e) => {
    e.preventDefault();
    if (value === "" || value === undefined) {
      phoneNumberError();
    }
    try {
      const response = await setUpRecaptcha(value);
      setConfirmObj(response);
      phoneNumberSuccess();
    } catch (error) {
      phoneNumberError();
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp === "" || otp === null) {
      otpFailure();
    }
    try {
      await confirmObj.confirm(otp);
      otpSuccess();
    } catch (error) {
      otpFailure();
    }
  };

  return (
    <div className="loginForm lg:w-[50%] w-full  h-full">
      <form onSubmit={onSubmit} className="w-full h-[95%]  flex flex-col justify-center">
        
        <div className="flex justify-between h-[12%] mb-[2%]">
          <div className="w-[49.5%]  h-full">
            <UserOutlined className="absolute ml-[2rem] mt-[1rem] text-lg text-gray-600" />
            <input
              id="firstName"
              placeholder="First Name"
              name="FirstName"
              value={firstName}
              className="pl-[4rem]    mb-[1rem]  border-2  border-violet-700 focus:border-green-500 authip w-full h-full"
              style={{ fontSize: "1.1rem" }}
              onChange={formChange}
              required
            />
          </div>
          <div className="w-[49.5%] inline-block h-full">
            <UserOutlined className="absolute ml-[2rem] mt-[1rem] text-lg text-gray-600" />
            <input
              id="lastName"
              placeholder="Last Name"
              name="LastName"
              value={lastName}
              className="pl-[4rem]   border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
              style={{ fontSize: "1.1rem" }}
              onChange={formChange}
              required
            />
          </div>
        </div>

        <div className="w-full h-[12%] mb-[2%]">
          <FontAwesomeIcon
            icon={faHashtag}
            className="absolute ml-[2rem] mt-[1.7rem] text-lg text-gray-600"
          />
          <input
            id="roll"
            value={roll}
            name="roll"
            placeholder="Enter Your Roll number"
            className="pl-[4rem]  block border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required
          />
        </div>

        <div className="w-full h-[12%] mb-[2%]">
          <MailOutlined className="absolute ml-[2rem] mt-[1.1rem] text-lg text-gray-600" />
          <input
            id="email"
            value={email}
            name="Email"
            placeholder="Enter Your Email"
            className="pl-[4rem]  block border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required
          />
        </div>
        <div className=" h-0 flex justify-end pr-[2rem] ">
          {!showPassword ? (
            <AiFillEye
              className="text-[1.5rem] text-violet-800 relative top-[1.55rem] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          ) : (
            <AiFillEyeInvisible
              className="text-[1.5rem] text-violet-800 relative top-[1.55rem] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          )}
        </div>
        <div className="w-full h-[12%] mb-[2%]">
          <AiOutlineLock className="absolute ml-[2rem] mt-[1.3rem] text-2xl text-gray-600" />
          <input
            id="password"
            name="Password"
            type={!showPassword ? "password" : "text"}
            value={password}
            minLength="6"
            placeholder="Enter Your Password"
            className="pl-[4rem]  block border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required
          />
        </div>
        <div className="w-full h-[12%] mb-[2%]">
          {/* <FontAwesomeIcon
              icon={faCheck}
              className="absolute ml-[2rem] mt-[1.7rem] text-xl text-red-600"
              style={isEqual ? { color: "green" } : {}}
            />
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              placeholder="Confirm Password"
              className="pl-[4rem] py-5 block border-2  border-violet-700 focus:border-green-500 authip w-[41.4rem]"
              style={{
                fontSize: "1.1rem",
                border: isEqual ? "" : "2px solid red",
              }}
              onChange={formChange}
              required
            />
            <p
              className="ml-10 mt-3 text-red-600"
              style={{ visibility: isEqual ? "hidden" : "visible" }}
            >
              Passwords don't match
            </p> */}
          <GrGroup className="absolute ml-[2rem] mt-[1.6rem] text-lg text-gray-300" />
          <div className=" h-0 flex justify-end pr-[2rem]">
            <DownOutlined className="text-[1.3rem] text-violet-800 relative top-[1.4rem] cursor-pointer" />
          </div>
          <select
            id="batch"
            class=" custom-select authip border-2  border-violet-700 focus:border-green-500 text-gray-500 text-sm  focus:ring-blue-500   pl-[4rem]  dark:focus:ring-blue-500 dark:focus:border-blue-500 inline w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
          >
            <option selected value="1">
              Batch 1
            </option>
            <option value="2">Batch 2</option>
          </select>
        </div>
        <div
          className="logFormBottom mt-2 flex"
          style={{ justifyContent: "flex-start" }}
        >
          <button className="loginButton font-bold text-xl text-white mr-4">
            Sign Up
          </button>
          <p
              className="fgPass text-lg mt-[1.6rem] hover:text-violet-700 transition-all duration-150 ease-in-out cursor-pointer"
              onClick={props.click}
            >
              Register as Faculty
            </p>
        </div>
        <ToastContainer />
      </form>
    </div>
  );
};
export default SignUp;
