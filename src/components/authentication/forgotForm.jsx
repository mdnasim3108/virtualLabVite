import { sendPasswordResetEmail, getAuth } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { app } from "../../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
const ForgotForm = (props) => {
  const auth = getAuth(app);
  const [email, setEmail] = useState("");
  const forgotSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const userCredentials = await sendPasswordResetEmail(auth, email);
      toast.success("password reset link sent to the registered email");
      props.sent()
      // setValue({ value: email, isValid: true })
    } catch {
      toast.error("The email is not registered!");
    }
  };
  return (
    <div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-center">
      <div className="lg:w-[70%] w-full">
        <form onSubmit={forgotSubmitHandler} className="">
          <label className="text-lg text-center">
            Enter the registered Email
          </label>
          <input
            className={`pl-[4rem] py-5 w-full block text-lg  border-2 mt-5   overflow-visible  border-violet-700 focus:border-green-500`}
            placeholder="Email"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex mt-4 items-center">

          <button
            type="submit"
            className="bg-violet-700 p-4 rounded  text-xl text-white"
          >
            Send password reset link
          </button>

          <p className="text-lg text-gray-400 cursor-pointer" onClick={props.back}><FontAwesomeIcon icon={faArrowLeft} className="w-[2rem]"/>Back</p>

          </div>
          
        </form>
      </div>
    </div>
  );
};
export default ForgotForm;
