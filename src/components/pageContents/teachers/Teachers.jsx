import { faMailBulk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { api } from "../../../constants";
import axios from "axios";
import { Link } from "react-router-dom";
const Teachers = () => {
  const [faculty, setFaculty] = useState([]);
  useEffect(() => {
    axios.get(`${api}/users?filters[userRole][$eqi]=faculty`).then((res) => {
      setFaculty(
        res.data.map((faculty) => {
          return {
            key: faculty.id,
            Name: faculty.username,
            Email: faculty.email,
            Action: (
              <a className="ml-3" href={`mailto:${faculty.email}`}>
                <MailOutlined className="text-xl" />
              </a>
            ),
          };
        })
      );
      console.log(res);
    });
  }, []);


  const columns = [
    {
      title: "Faculty Name",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Faculty Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
    },
  ];
  return (
    <div className="w-full h-screen pt-[1rem]  bg-gray-100 text-center">
      <Table
        dataSource={faculty}
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
  );
};
export default Teachers;
