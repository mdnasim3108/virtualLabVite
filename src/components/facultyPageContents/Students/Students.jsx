import { Table, Spin, Modal } from "antd";
import { useState, useEffect, useContext } from "react";
import userContext from "../../../contextStore/context";
import { useNavigate } from "react-router";
import StudentDetail from "./studentDetail";
const Students = () => {
  const navigate = useNavigate();
  const { students, submissionsData, experiments } = useContext(userContext);
  const [studentData, setStudentData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({
    name: "",
    roll: "",
    completed: [],
  });
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (students.length) {
      const studentsInfo = students.map((student) => {
        return {
          key: student.id,
          studentId: student.id,
          studentName: student.username,
          studentEmail: student.email,
          Roll: student.roll,
        };
      });
      setStudentData(studentsInfo);
    }
  }, [students]);

  const handleRowClick = (record) => {
    console.log("Row clicked:", record);
  };

  const rowProps = (record) => {
    return {
      onClick: () => {
        const submissionIndex = submissionsData.findIndex(
          (submission) => submission.roll == record.Roll
        );
        let titles;
        if(submissionIndex>=0){
        const finishedExperimentsNo = submissionsData[
          submissionIndex
        ].finishedExperiments.map((e) => e.ExpNo);
        titles = finishedExperimentsNo.map((exp) => {
          const expIndex = experiments.findIndex((e) => +e.expNo === exp);
          if (expIndex >= 0) return experiments[expIndex].expTitle;
          else return "not found experiment";
        });
      }
        setSelectedData({
          name: record.studentName,
          roll: record.Roll,
          completed: titles?titles:[],
        })
        handleRowClick(record);
        showModal();
      },
    };
  };

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
      <Modal
        title="Student Detail"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        {<StudentDetail student={selectedData}/>}
      </Modal>
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
        onRow={rowProps}
      />
    </div>
  );
};

export default Students;
