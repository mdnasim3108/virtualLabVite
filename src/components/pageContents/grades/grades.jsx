import axios from "axios";
import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
import userContext from "../../../contextStore/context";
const Grades=()=>{
    const [gradings,setGradings]=useState([])
    const {user,experiments}=useContext(userContext)
  
    useEffect(()=>{
      axios.get(`http://localhost:1337/api/submissions?filters[roll][$eqi]=${user.roll}&populate=*`).then((res)=>setGradings(
        res.data.data[0].attributes.Experiments.filter(obj => obj.output).map((exp)=>{
          const index=experiments.findIndex(experiment=>experiment.expNo==exp.ExpNo)
          const experimentName=experiments[index].expTitle
          return {
            key:exp.id,
            Experiment:exp.ExpNo,
            Experiment_Name:experimentName,
            Observation:exp.observation,
            Output:exp.output,
            Viva:exp.viva
          }
        
        })
      ))
    },[])
   
    const columns = [
        {
          title: "Exp No.",
          dataIndex: "Experiment",
          key: "Experiment",
          width: "10%",
        },
        {
          title: "Experiment Name",
            dataIndex: "Experiment_Name",
            key: "Experiment_Name",
            width: "30%",
          },
        {
          title: "Observation",
          dataIndex: "Observation",
          key: "Observation",
          width: "20%",
        },
        {
          title: "Output",
          dataIndex: "Output",
          key: "Output",
          width: "20%",
        },
        {
          title: "Viva",
          dataIndex: "Viva",
          key: "Viva",
          width: "20%",
        }
      ];
    return  <div className="w-full h-screen pt-[1rem]  bg-gray-100 text-center">
        <Table
          dataSource={gradings}
          columns={columns}
          className="w-[95%] mx-auto" pagination={{
            style: { visibility: "hidden" },
          }}
          scroll={{
            y: 450,
          }}
        />
    </div>
}
export default Grades;