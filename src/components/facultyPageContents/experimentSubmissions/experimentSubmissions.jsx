import { Dropdown, Button, Tag, Table, Spin, Modal, Input } from "antd";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../constants";
import axios from "axios";
import userContext from "../../../contextStore/context";
import { DownOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
const ExperimentSubmissions = () => {
  const { experiments, selected, setSelected, students } =
    useContext(userContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({
    roll: "",
    name: "",
    experiment: "",
    submissionId: "",
  });
  const [data, setData] = useState([]);
  const [submission, setSubmission] = useState([]);
  const [formData, setFormData] = useState({
    observation: "",
    output: "",
    viva: "",
  });
  const items = experiments.map((exp) => {
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
      key: "Student Name",
      width: "20%",
    },
    {
      title: "Last Submitted",
      dataIndex: "lastSub",
      key: "lastSub",
      width: "15%",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        let color = status === "unGraded" ? "geekblue" : "green";
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      width: "10%",
    },
    {
      title: "Timeliness",
      key: "timeliness",
      dataIndex: "timeliness",
      render: (_, { timeliness }) => {
        let color = timeliness === "overdue" ? "red" : "green";
        return (
          <Tag color={color} key={timeliness}>
            {timeliness}
          </Tag>
        );
      },
      width: "10%",
    },
    {
      title: "Link",
      key: "Link",
      dataIndex: "Link",
      width: "10%",
    },
    {
      title: "grading",
      key: "grading",
      dataIndex: "grading",
      width: "20%",
    },
  ];
  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: +e.target.value });
  };
  const gradingsHandler = () => {
    console.log(formData);
    setFormData({
      observation: "",
      output: "",
      viva: "",
    });
    const studentIndex = submission.findIndex(
      (el) => el.id === selectedData.submissionId
    );
    const data = submission[studentIndex].finishedExperiments;
    const experimentIndex = data.findIndex((el) => el.ExpNo == selected.no);
    const updated = [...data];
    updated[experimentIndex] = {
      ...updated[experimentIndex],
      ...formData,
      total: formData.observation + formData.output + formData.viva,
    };
    console.log(data);
    axios
      .put(`${api}/submissions/${selectedData.submissionId}?populate=*`, {
        data: { Experiments: updated },
      })
      .then((res) => {
        setSubmission((prev) => {
          const updatedSubmission = [...prev];
          updatedSubmission[studentIndex] = {
            ...updatedSubmission[studentIndex],
            finishedExperiments: res.data.data.attributes.Experiments,
          };
          return updatedSubmission;
        });
        handleCancel()
      });
  };
  const addModalContent = (
    <form>
      <div className="w-full text-center">
        <h1 className=" text-xl font-semibold">
          {selectedData.name}({selectedData.roll})
        </h1>
        <h1 className="text-lg ">
          {selected.no}) {selectedData.experiment}
        </h1>
      </div>
      <div>
        <label>observation & preparation</label>
        <Input
          placeholder="observation"
          id="observation"
          onChange={changeHandler}
          required
          type="number"
          value={formData.observation}
        />
      </div>
      <div className="mt-3">
        <label>output</label>
        <Input
          placeholder="output"
          id="output"
          onChange={changeHandler}
          value={formData.output}
          required
          type="number"
        />
      </div>
      <div className="mt-3">
        <label>viva</label>
        <Input
          placeholder="viva"
          id="viva"
          onChange={changeHandler}
          type="number"
          value={formData.viva}
          required
        />
      </div>
    </form>
  );
  const pdfGenerateHandler = (code, output, roll, name, experimentName) => {
    const doc = new jsPDF();

    doc.text(
      `
                                  ${selected.no}.) ${experimentName}


    roll no: ${roll}                                          name: ${name}

  
    code:
    ${code}




    

    output:

    ${output}
     `,
      10,
      10
    );

    doc.save(`${roll}.pdf`);
  };
  useEffect(() => {
    axios.get(`${api}/submissions?populate=*`).then((res) =>
      setSubmission(
        res.data.data.map((el) => {
          return {
            id: el.id,
            roll: el.attributes.roll,
            finishedExperiments: el.attributes.Experiments,
          };
        })
      )
    );
  }, []);

  useEffect(() => {
    if (submission.length && experiments.length) {
      const completedStudents = submission.filter((el) =>
        el.finishedExperiments.map((el) => el.ExpNo).includes(selected.no)
      );
      if (completedStudents.length) {
        setData(
          completedStudents.map((el) => {
            const id = el.finishedExperiments.findIndex(
              (el) => el.ExpNo === selected.no
            );
            const exp = el.finishedExperiments[id];
            const expIndex = experiments.findIndex(
              (experiment) => experiment.expNo == selected.no
            );
            const experimentData = experiments[expIndex];
            const studentId = students.findIndex(
              (student) => student.roll === el.roll
            );
            const studentData = students[studentId];
            return {
              key: el.id,
              Roll: el.roll,
              Student_Name: studentData.username,
              lastSub: exp.Submitted_Date,
              status: exp.total ? "graded" : "unGraded",
              timeliness:
                new Date(exp.Submitted_Date) < new Date(experimentData.Due)
                  ? "timely"
                  : "overdue",
              Link: (
                <p
                  className="underline cursor-pointer"
                  onClick={() =>
                    pdfGenerateHandler(
                      exp.code,
                      exp.outputContent,
                      el.roll,
                      studentData.username,
                      experimentData.expTitle
                    )
                  }
                >
                  download link
                </p>
              ),
              grading: (
                <Button
                  onClick={() => {
                    setSelectedData({
                      roll: el.roll,
                      name: studentData.username,
                      experiment: experimentData.expTitle,
                      submissionId: el.id,
                    });
                    showModal();
                  }}
                >
                  {exp.total ? "Update marks" : "Assign marks"}
                </Button>
              ),
            };
          })
        );
      } else {
        setData(false);
      }
    }
  }, [selected, submission, experiments]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Modal
        title=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={gradingsHandler}>
            Submit
          </Button>,
        ]}
      >
        {addModalContent}
      </Modal>
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
          style: { visibility: "hidden" },
        }}
        scroll={{
          y: 450,
        }}
      />
    </div>
  );
};
export default ExperimentSubmissions;
