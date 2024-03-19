import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
const verify = (props) => {
  const [valid,setValid]=useState(true)
  const [otp,setOTP]=useState("")
  const submithandler=()=>{
    if(otp===props.otp){
      props.submit()
    }
    else{
      setValid(false)
    }
  }
  return (
    <div className="lg:w-[50%] w-full h-full flex flex-col items-center justify-center my-10 lg:m-0">
      <div className="lg:w-[70%] w-full">
        <form onSubmit={submithandler}>
          <label className="text-lg text-center">  
            Enter the OTP sent to {props.email}
          </label>
          <input
            className={`lg:pl-[4rem] lg:py-5 pl-[2rem] py-3 w-full block text-lg  border-2 mt-5   overflow-visible   focus:border-green-500 ${valid?"border-violet-700":"border-red-500"}`}
            placeholder="OTP"
            type="text"
            required
            onChange={(e) => setOTP(e.target.value)}
          />
          <div className="flex mt-4 items-center">
            <button
              type="submit"
              className="bg-violet-700 lg:py-4 lg:px-5 p-2 rounded  lg:text-xl text-lg text-white"
            >
              Verify
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
export default verify;
