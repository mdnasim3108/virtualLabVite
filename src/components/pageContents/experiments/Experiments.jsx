import { Table, Spin, Button, Dropdown } from "antd";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { api } from "../../../constants";
import userContext from "../../../contextStore/context";
import useHttp from "../../../hooks/use-http";
import { useNavigate } from "react-router";
import { DownOutlined } from "@ant-design/icons";
const Experiments = () => {
  const navigate = useNavigate();
  const {
    setExperiments,
    experiments,
    setKeys,
    setSelected,
    progress,
    addExperiment,
    submission,
    labs,
    selectedLab,
    user,
    setSelectedLab,
    UserSelectedLab
  } = useContext(userContext);
 

  const [expTable, setExpTable] = useState([]);

  useEffect(() => {
    if (experiments.length && UserSelectedLab) {
      console.log(user);
      console.log(labs);

      const tableData = experiments
      .filter((exp) => exp.lab == UserSelectedLab.code)
      .map((exp) => {
          return {
            ...exp,
            expLink: (
              <p
                onClick={() => {
                  setSelected({ name: exp.expTitle, no: +exp.expNo });
                  setKeys(["/editor"]);
                  navigate(`/editor/${exp.expNo}`);
                }}
                className={`underline cursor-pointer`}
              >
                do Experiment
              </p>
            ),
          };
        });
      setExpTable(tableData);
    }
  }, [experiments,UserSelectedLab]);


  const columns = [
    {
      title: "Exp No.",
      dataIndex: "expNo",
      key: "expNo",
      width: "10%",
    },
    {
      title: "Exp Title",
      dataIndex: "expTitle",
      key: "expTitle",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "expDesc",
      key: "expDesc",
      width: "30%",
    },
    {
      title: "Due Date",
      dataIndex: "Due",
      key: "Due",
      width: "20%",
    },
    {
      title: "Exp Link",
      dataIndex: "expLink",
      key: "expLink",
      width: "20%",
    },
  ];
  return (
    <Spin spinning={expTable.length === 0}>
      <div className="w-full h-screen pt-[1rem]  bg-gray-100 text-center">
        {/* <Dropdown menu={{ items }} className="my-5">
          <Button className="">
            {selectedLab.name}

            <DownOutlined className=" w-5 ml-1 mb-1 text-black" />
          </Button>
        </Dropdown> */}

        <Table
          dataSource={expTable}
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
    </Spin>
  );
};
export default Experiments;
