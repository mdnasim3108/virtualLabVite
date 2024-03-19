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
import Verify from "./verify";
const SignUp = (props) => {
  const toastifySuccess = (msg) => { 
    toast.success(msg, {
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
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [mailValid,setMailValid]=useState(true)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = useState("");
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
    semester: "",
  });

  const { firstName, lastName, email, password, confirmPassword, roll, semester } =
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

  const sendOTP = () => {
    setShowOTP(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!mailValid){
      toastifyFailure("Enter a valid GCT Email address")
      return
    }
    try {
      setLoading(true);

      const response = await axios.post(`${api}/auth/local/register`, {
        name: firstName + " " + lastName,
        username: firstName + " " + lastName,
        email: email,
        password: password,
        roll,
        semester: semester,
        userRole: "student",
      });
      toastifySuccess("Successfully SignedUp !!");
      setLoading(false);
      props.showlogin();
    } catch (error) {
      setLoading(false);

      console.log(error);
      toastifyFailure(error.message);
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

  return !showOTP ? (
    <div className="loginForm lg:w-[50%] w-full  h-full">
      <form
        onSubmit={onSubmit}
        className="w-full lg:h-[95%]  flex flex-col justify-center"


        
      >
        <div className="flex justify-between lg:h-[12%] lg:mb-[2%]">
          <div className="w-[49.5%]  h-full">
            <UserOutlined className="absolute lg:ml-[2rem] ml-[1rem] mt-[1rem] text-lg text-gray-600" />
            <input
              id="firstName"
              placeholder="First Name"
              name="FirstName"
              value={firstName}
              className="lg:pl-[4rem] pl-[2.8rem] py-3  mb-[1rem]  border-2  border-violet-700 focus:border-green-500 authip w-full h-full"
              style={{ fontSize: "1.1rem" }}
              onChange={formChange}
              required
            />
          </div>
          <div className="w-[49.5%] inline-block h-full">
            <UserOutlined className="absolute lg:ml-[2rem] ml-[1rem] mt-[1rem] text-lg text-gray-600" />
            <input
              id="lastName"
              placeholder="Last Name"
              name="LastName"
              value={lastName}
              className="lg:pl-[4rem] pl-[2.8rem]  py-3  border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
              style={{ fontSize: "1.1rem" }}
              onChange={formChange}
              required
            />
          </div>
        </div>

        <div className="w-full lg:h-[12%] lg:mb-[2%]">
          <FontAwesomeIcon
            icon={faHashtag}
            className="absolute lg:ml-[2rem] ml-[1rem] mt-[1.2rem] text-lg text-gray-600"
          />
          <input
            id="roll"
            value={roll}
            name="roll"
            placeholder="Enter Your Roll number"
            className="lg:pl-[4rem] pl-[2.8rem]  py-3 block border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required
          />
        </div>

        <div className="w-full lg:h-[12%] lg:mb-[2%]">
          <MailOutlined className="absolute lg:ml-[2rem] ml-[1rem] mt-[1.1rem] text-lg text-gray-600" />
          <input
            id="email"
            value={email}
            name="Email"
            placeholder="Enter a valid GCT Email address"
            className={`lg:pl-[4rem] pl-[2.8rem]  py-3 block border-2   ${mailValid?"border-violet-700":"border-red-500"} focus:${mailValid?"border-green-500":"border-red-500"} mb-[1rem] authip w-full h-full`}
            style={{ fontSize: "1.1rem" }}
            onChange={(e)=>{
              formChange(e)
              setMailValid(e.target.value.includes("@gct.ac.in"))
            }}
            required
          />
        </div>
        <div className=" h-0 flex justify-end pr-[2rem] ">
          {!showPassword ? (
            <AiFillEye
              className="text-[1.5rem] text-violet-800 relative lg:top-[1.3rem] top-[1rem] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          ) : (
            <AiFillEyeInvisible
              className="text-[1.5rem] text-violet-800 relative lg:top-[1.3rem] top-[1rem] cursor-pointer"
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
            />
          )}
        </div>
        <div className="w-full lg:h-[12%] lg:mb-[2%]">
          <AiOutlineLock className="absolute lg:ml-[2rem] ml-[1rem] mt-[1rem] text-2xl text-gray-600" />
          <input
            id="password"
            name="Password"
            type={!showPassword ? "password" : "text"}
            value={password}
            minLength="6"
            placeholder="Enter Your Password"
            className="lg:pl-[4rem] pl-[2.8rem]  py-3 block border-2  border-violet-700 focus:border-green-500 mb-[1rem] authip w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required
          />
        </div>
        <div className="w-full lg:h-[12%] lg:mb-[2%]">
          <GrGroup className="absolute lg:ml-[2rem] ml-[1rem] mt-[1rem] text-lg text-gray-300" />
          <div className=" h-0 flex justify-end pr-[2rem]">
            <DownOutlined className="text-[1.3rem] text-violet-800 relative top-[1.4rem] cursor-pointer" />
          </div>
          <select
            id="semester"
            className=" custom-select py-3 authip border-2  border-violet-700 focus:border-green-500 text-gray-500 text-sm  focus:ring-blue-500   lg:pl-[4rem] pl-[2.8rem]   dark:focus:ring-blue-500 dark:focus:border-blue-500 inline w-full h-full"
            style={{ fontSize: "1.1rem" }}
            onChange={formChange}
            required={true}
          >
            <option  hidden value="">
              Select semester
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>
        <div
          className="logFormBottom lg:mt-2 mt-7 flex items-center"
          style={{ justifyContent: "flex-start" }}
        >
          <button
            disabled={loading}
            className={`loginButton font-bold text-xl text-white mr-4 py-[1.5rem] lg:w-[15rem] w-[9rem] ${
              loading ? "bg-gray-400" : "bg-violet-500"
            } transition-all duration-300 ease-in-out`}
          >
            {loading ? (
              <p className="lg:text-xl text-sm">SIGNING UP</p>
            ) : (
              <p className="lg:text-xl text-sm">SIGN UP</p>
            )}
          </button>
          <p
            className="fgPass text-lg  hover:text-violet-700 transition-all duration-150 ease-in-out cursor-pointer"
            onClick={props.click}
          >
            Register as Faculty
          </p>
        </div>
        <ToastContainer />
      </form>
    </div>
  ) : (
    <Verify
      otp={Math.floor(Math.random() * 6000000)}
      email={email}
      back={() => setShowOTP(false)}
      submit={onSubmit}
    />
  );
};
export default SignUp;
