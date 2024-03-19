import dsa_img from "../../../assets/dsa_image.jpg";
import { GoHash } from "react-icons/go";
import { SlNote } from "react-icons/sl";
import { PiStudent } from "react-icons/pi";
import { IoClipboardOutline } from "react-icons/io5";
import { useContext } from "react";
import userContext from "../../../contextStore/context";
import { FaCheck } from "react-icons/fa6";
const Lab = ({
  code,
  students,
  experiments,
  semester,
  img,
  name,
  labIndex,
  open
}) => {
  const {setUserSelectedLab,UserSelectedLab}=useContext(userContext)
  return (
    <div
      className={`w-full h-[90%] bg-white rounded-md border shadow-xl relative shrink-0 transition-all duration-500 ease-in-out`}
      style={{ translate: `${-100 * labIndex}%` }}
    >
      <img
        src={"http://localhost:1337" + img}
        className="w-full h-full opacity-[0.8] rounded-t-md"
      />
      <div className="w-full flex justify-center">
        <p className="font-bold text-3xl z-10 absolute top-10  text-white">
          {name}
        </p>
      </div>

      <div className="absolute bottom-0 text-white w-full bg-[rgba(0,0,0,0.5)] pb-5">
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="pl-5 flex items-center justify-center">
            <GoHash className=" mr-1" />
            <p className="text-white">{code}</p>
          </div>
          <div className=" flex items-center justify-center pr-5">
            <PiStudent className=" text-lg" />
            <p className="text-white">{students} Students</p>
          </div>
          <div className="pl-5 flex items-center justify-center">
            <SlNote className="   mr-1 text-[13px]" />
            <p className="text-white">{experiments} Experiments</p>
          </div>
          <div className="  flex items-center justify-center pr-5">
            <IoClipboardOutline className=" mr-1" />
            <p className="text-white">Semester {semester}</p>
          </div>
        </div>
        <div className="w-full px-5">
          <button   
            className={`w-full mt-3 p-2 rounded-md tracking-wide  border hover:bg-white hover:text-black bg-${
              UserSelectedLab.code === code ? "black text-white border-black" : "bg-white border-white"
            } transition-all duration-100 ease-linear`}
            onClick={() => {
              setUserSelectedLab({
                code,
                students,
                experiments,
                semester,
                name,
              });
              open("success", "Selected laboratory", name);
            }}
          >
            {UserSelectedLab.code === code ? (
              <p>
                SELECTED <FaCheck className="text-white inline ml-2 mb-1" />
              </p>
            ) : (
              "SELECT"
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
export default Lab;
