import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const StudentDetail = (props) => {
  return (
    <div>
      <div className="flex justify-between border-b-2 border-gray-300">
        <p>{props.student.name}</p>
        <p>{props.student.roll}</p>
      </div>

      <div className="h-[13rem] overflow-scroll">
        {props.student.completed.length ? (
          props.student.completed.map((exp) => (
            <div className="flex mt-3 " key={Math.random()}>
              <FontAwesomeIcon icon={faCheck} className="w-[2rem] mt-1" />
              <p>{exp}</p>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No Experiments found</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentDetail;
