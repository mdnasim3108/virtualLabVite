import { Dropdown, Button, Tag, Table, Spin, Modal, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../constants";
import axios from "axios";
import userContext from "../../../contextStore/context";
import { DownOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
const facultyGradings = () => {
  const {
    experiments,
    selected,
    setSelected,
    students,
    submissionsData: submission,
    setSubmissionsData,
    UserSelectedLab,
  } = useContext(userContext);
  const [items, setItems] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (UserSelectedLab)
      setItems(
        experiments
          .filter((exp) => exp.lab === UserSelectedLab.code)
          .map((exp) => {
            return {
              key: exp.key,
              label: (
                <p
                  onClick={() => {
                    setSelected({ name: exp.expTitle, no: +exp.expNo });
                  }}
                >
                  {exp.expTitle}
                </p>
              ),
            };
          })
      );
  }, [UserSelectedLab, experiments]);

  const columns = [
    {
      title: "Roll",
      dataIndex: "Roll",
      key: "Roll",
      render: (text) => <a>{text}</a>,
      width: "20%",
    },
    {
      title: "Student Name",
      dataIndex: "Student_Name",
      key: "Student_Name",
      width: "20%",
    },
    {
      title: "Observation",
      dataIndex: "Observation",
      key: "Observation",
      render: (grade) => {
        if (grade) return <p>{grade}</p>;
        else return <a className="text-xl font-bold">-</a>;
      },
      width: "20%",
    },
    {
      title: "Viva",
      key: "Viva",
      dataIndex: "Viva",
      render: (grade) => {
        if (grade) return <p>{grade}</p>;
        else return <a className="text-xl font-bold">-</a>;
      },
      width: "10%",
    },
    {
      title: "Output",
      key: "Output",
      dataIndex: "Output",
      render: (grade) => {
        if (grade) return <p>{grade}</p>;
        else return <a className="text-xl font-bold">-</a>;
      },
      width: "20%",
    },
    {
      title: "Total",
      key: "Total",
      dataIndex: "Total",
      render: (grade) => {
        if (grade) return <p>{grade}</p>;
        else return <a className="text-xl font-bold">-</a>;
      },
      width: "10%",
    },
  ];

  useEffect(() => {
    if (submission.length && experiments.length && students.length && UserSelectedLab) {
      const completedStudents = submission
      .filter((el) =>
          el.finishedExperiments
            .map((el) => el.lab)
            .includes(UserSelectedLab.code)
        )
      .filter((el) =>
        el.finishedExperiments.map((el) => el.ExpNo).includes(+selected.no)
      );
      if (completedStudents.length) {
        setData(
          completedStudents.map((el) => {
            const expIndex = el.finishedExperiments.findIndex(
              (e) => e.ExpNo == selected.no
            );
            const studIndex = students.findIndex((e) => e.roll == el.roll);
            return {
              Roll: students[studIndex].roll,
              Student_Name: students[studIndex].username,
              Observation: el.finishedExperiments[expIndex].observation,
              Viva: el.finishedExperiments[expIndex].viva,
              Output: el.finishedExperiments[expIndex].output,
              Total: el.finishedExperiments[expIndex].total,
            };
          })
        );
      } else {
        setData([]);
      }
    }
  }, [selected, submission, experiments, students,UserSelectedLab]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Dropdown menu={{ items }} className="my-5">
        <Button className="">
          {selected.name}
          <DownOutlined className=" w-5 ml-1 mb-1 text-black" />
        </Button>
      </Dropdown>

      <Table
        dataSource={data}
        columns={columns}
        className="w-[98%] mx-auto"
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
export default facultyGradings;
