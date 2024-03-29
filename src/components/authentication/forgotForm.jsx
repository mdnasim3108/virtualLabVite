import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { app } from "../../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { api } from "../../constants";
import axios from "axios";
const ForgotForm = (props) => {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const forgotSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.post(`${api}/auth/forgot-password`,{email}).then((res) => {
        toast.success("password reset link sent to the registered email");
        props.sent();
      });

    } catch(er) {
      toast.error(er.message);
    }
  };
  return (
    <div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-center my-10 lg:m-0">
      <div className="lg:w-[70%] w-full">
        <form onSubmit={forgotSubmitHandler}>
          <label className="text-lg text-center">
            Enter the registered Email
          </label>
          <input
            className={`lg:pl-[4rem] lg:py-5 pl-[2rem] py-3 w-full block text-lg  border-2 mt-5   overflow-visible  border-violet-700 focus:border-green-500`}
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex mt-4 items-center">
            <button
              type="submit"
              className="bg-violet-700 lg:p-4 p-2 rounded  lg:text-xl text-lg text-white"
            >
              Send password reset link
            </button>

            <p
              className="text-lg text-gray-400 cursor-pointer"
              onClick={props.back}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="w-[2rem]" />
              Back
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ForgotForm;
