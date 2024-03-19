import axios from "axios";
import { Table } from "antd";
import { useContext, useEffect, useState } from "react";
import userContext from "../../../contextStore/context";
import { api } from "../../../constants";
const Grades=()=>{
    const [gradings,setGradings]=useState([])
    const {user,experiments,UserSelectedLab}=useContext(userContext)
  
    useEffect(()=>{
      if(experiments.length && UserSelectedLab)
      axios.get(`${api}/submissions?filters[roll][$eqi]=${user.roll}&populate=*`).then((res)=>setGradings(
        res.data.data[0]?.attributes.Experiments.filter(obj => obj.output).filter(exp=>exp.lab===UserSelectedLab.code).map((exp)=>{
          const filteredExps=experiments.filter(exp=>exp.lab===UserSelectedLab.code)
          const {expTitle} = filteredExps.find(experiment=>experiment.lab===UserSelectedLab.code && experiment.expNo==exp.ExpNo)
          return {
            key:exp.id,
            Experiment:exp.ExpNo,
            Experiment_Name:expTitle,
            Observation:exp.observation,
            Output:exp.output,
            Viva:exp.viva
          }
        
        })
      ))
    },[experiments,UserSelectedLab])
   
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