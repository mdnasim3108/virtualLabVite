import { Table, Spin } from "antd";
import { useState, useEffect, useContext } from "react";
import userContext from "../../../contextStore/context";
import { useNavigate } from "react-router";

const Students = () => {
  const navigate = useNavigate();
  const { students } = useContext(
    userContext
  );
  const [studentData,setStudentData]=useState([])
  useEffect(() => {
    if (students.length) {
      const studentsInfo = students.map((student) => {
       
        return {
          key: student.id,
          studentId: student.id,
          studentName: student.username,
          studentEmail: student.email,
          Roll:student.roll
        };
      }
      )
      setStudentData(studentsInfo)
    }
  }, [students]);

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
        title: "Roll No.",
        dataIndex: "Roll",
        key: "Roll",
      },
    {
      title: "Student Name",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Email",
      dataIndex: "studentEmail",
      key: "studentEmail",
    },
   
  ];

  return (
      <div className="w-full h-screen pt-[1rem] bg-gray-100">
        <Table
          dataSource={studentData}
          columns={columns}
          className="w-[95%] mx-auto"
          pagination={{
            position: ["bottomCenter"],
          }}
          scroll={{
            y: 450,
          }}
        />
      </div>
  );
};

export default Students;

