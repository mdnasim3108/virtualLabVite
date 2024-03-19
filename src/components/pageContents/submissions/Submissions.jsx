import { Space, Table, Tag, Spin } from "antd";
import { useContext, useEffect, useState } from "react";
import { api } from "../../../constants";
import userContext from "../../../contextStore/context";
import axios from "axios";
import useHttp from "../../../hooks/use-http";
const Submissions = () => {
  const { user, experiments, setExperiments, submission, UserSelectedLab } =
    useContext(userContext);
  const [submissionData, setSubmissionData] = useState([]);
  useEffect(() => {
    if (submission && UserSelectedLab &&experiments.length) {
      console.log(submission)
      console.log(UserSelectedLab)
      setSubmissionData(
        submission.Experiments.filter(sub=>sub.lab==UserSelectedLab.code).map((sub) => {
          const exp = experiments.find(exp=>exp.lab===UserSelectedLab.code && exp.expNo==sub.ExpNo)
          return {
            key: sub.ExpNo,
            expId: sub.ExpNo,
            expName: exp.expTitle,
            lastSub: sub.Submitted_Date,
            status: sub.output ? "graded" : "unGraded",
            timeliness:
              new Date(sub.Submitted_Date) < new Date(exp.Due)
                ? "timely"
                : "overdue",
            lab: sub.lab,
          };
        }).filter((sub) => sub.lab == UserSelectedLab.code)
      );
    }
  }, [submission, UserSelectedLab,experiments]);

  const columns = [
    {
      title: "Experiment Id",
      dataIndex: "expId",
      key: "expId",
      render: (text) => <a>{text}</a>,
      width: "20%",
    },
    {
      title: "Experiment Name",
      dataIndex: "expName",
      key: "expName",
      width: "20%",
    },
    {
      title: "Last Submitted",
      dataIndex: "lastSub",
      key: "lastSub",
      width: "20%",
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
      width: "20%",
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
      width: "20%",
    },
  ];
  return (
    // <Spin spinning={loading}>
    <div className="w-full h-screen pt-[1rem]  bg-gray-100">
      <Table
        dataSource={submissionData}
        columns={columns}
        className="w-[95%] mx-auto"
        pagination={{
          style: { visibility: "hidden" },
        }}
        scroll={{
          y: 450,
        }}
      />
    </div>
    // </Spin>
  );
};
export default Submissions;
