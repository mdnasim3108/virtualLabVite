import dsa_img from "../../../assets/dsa_image.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import userContext from "../../../contextStore/context";
import { notification } from "antd";
import StudentLab from "./StudentLab";
const StudentAvailableLabs = () => {
  const { students, labs: labData, experiments,user } = useContext(userContext);
  const [labIndex, setLabIndex] = useState(0);
  const [labs, setLabs] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "top",
    });
  };
  useEffect(() => {
    setLabs(
      labData.filter(lab=>lab.semester==user.semester).map(lab => {
        const studentCount=students.reduce((acc,curr)=>{
            return curr.semester===lab.semester?acc+1:acc
        },0)
        const experimentCount=experiments.reduce((acc,curr)=>{
            return curr.lab===lab.labCode?acc+1:acc
        },0)
        return {
          code: lab.labCode,
          students: studentCount,
          experiments: experimentCount,
          semester: lab.semester,
          name: lab.name,
          img: lab.image
        };
      })
    );
  }, [labData]);
  const nextHandler = () => {
    setLabIndex((index) => {
      if (index === labs.length - 1) return 0;
      return index + 1;
    });
  };

  const prevHandler = () => {
    setLabIndex((index) => {
      if (index === 0) return labs.length - 1;
      return index - 1;
    });
  };

  return (
    <div className="h-[70%] pt-5 w-full flex justify-evenly ">
      {contextHolder}
      <div className=" flex items-center h-[90%] text-gray-700 text-xl ">
        <FaChevronLeft className="cursor-pointer" onClick={prevHandler} />
      </div>

      <div className="w-full flex overflow-hidden ">
        {labs.map((lab) => (
          <StudentLab {...lab} labIndex={labIndex} open={(type,message,description)=>openNotificationWithIcon(type,message,description)} />
        ))}
      </div>

      <div className=" flex items-center h-[90%] text-gray-700 text-xl ">
        <FaChevronRight className="cursor-pointer" onClick={nextHandler} />
      </div>
    </div>
  );
};
export default StudentAvailableLabs;
