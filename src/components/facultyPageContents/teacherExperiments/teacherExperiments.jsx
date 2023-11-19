import { Table, Spin, Button, Modal, Input, notification } from "antd";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { api as strapiApi } from "../../../constants";
import userContext from "../../../contextStore/context";
import useHttp from "../../../hooks/use-http";
import { useNavigate } from "react-router";
const Experiments = () => {
    const navigate = useNavigate()
    const { setExperiments, experiments, setKeys, setSelected, progress } = useContext(userContext);
    const { loading, data, error } = useHttp({ url: `${strapiApi}/experiments`, method: "GET" })
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, message, description) => {
        api[type]({
            message,
            description
        });
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setData] = useState({

        ExperimentNo: "",
        Experiment_Name: "",
        Description: "",
        Due_Date: ""

    })

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const addExperimentHandler = () => {
        const { ExperimentNo, Experiment_Name, Description, Due_Date } = formData
        if (!ExperimentNo.length || !Experiment_Name.length || !Description.length || !Due_Date.length) {
            openNotificationWithIcon('error', 'All fields required', 'Fill the required fields to add the experiment')
            return
        }
        axios.post(`http://localhost:1337/api/experiments`, { data: formData }).then((res) => {
            console.log(formData)
            console.log(res)
            setExperiments([...experiments, {
                key: +(res.data.data.attributes.ExperimentNo),
                expTitle: res.data.data.attributes.Experiment_Name,
                expNo: res.data.data.attributes.ExperimentNo,
                Due: res.data.data.attributes.Due_Date,
                expDesc: res.data.data.attributes.Description
            }])
            openNotificationWithIcon('success', 'Experiment added', 'Experiment has been added sucessfully')
            handleCancel()
            setData({
                ExperimentNo: "",
                Experiment_Name: "",
                Description: "",
                Due_Date: ""
            })
        })

    }
    const changeHandler = (e) => {
        setData({ ...formData, [e.target.id]: e.target.value })
    }
    // useEffect(() => {
    //     if (data) {
    //         console.log(progress)

    //         console.log(data.data)

    //         const experiments = data.data.map((exp) => {


    //             return {
    //                 key: exp.id,
    //                 expNo: exp.attributes.ExperimentNo,
    //                 expTitle: exp.attributes.Experiment_Name,
    //                 expDesc: exp.attributes.Description,
    //                 Due: exp.attributes.Due_Date,
    //                 // expLink: (
    //                 //     <p onClick={() => {
    //                 //         setSelected({ name: exp.attributes.Experiment_Name, no: +(exp.id) })
    //                 //         setKeys(["/editor"])
    //                 //         navigate(`/editor/${code ? code : "12345"}`)
    //                 //     }} className="underline cursor-pointer">
    //                 //         do Experiment
    //                 //     </p>
    //                 // ),
    //             };
    //         });
    //         setExperiments(experiments);
    //     }
    // }, [data])

    const addModalContent = <form>
        <div>
            <label>Experiment Number</label>
            <Input placeholder="experiment no." id="ExperimentNo" onChange={changeHandler} required type="number" value={formData.ExperimentNo} />
        </div>

        <div className="mt-3">
            <label>Experiment Name</label>
            <Input placeholder="experiment name" id="Experiment_Name" onChange={changeHandler} value={formData.Experiment_Name} required />
        </div>
        <div className="mt-3">
            <label>Experiment Description</label>
            <Input placeholder="experiment description" id="Description" onChange={changeHandler} value={formData.Description} className="pb-10" required />
        </div>
        <div className="mt-3">
            <label>Experiment Due</label>
            <Input placeholder="experiment Due date" id="Due_Date" onChange={changeHandler} type="date" value={formData.Due_Date} required />
        </div>

    </form>

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
            width: "50%",
        },
        {
            title: "Due Date",
            dataIndex: "Due",
            key: "Due",
            width: "20%",
        },

    ];
    return (
        <Spin spinning={experiments.length === 0}>
            {contextHolder}

            <Modal title="Add new Experiment" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={addExperimentHandler}>
                        Add
                    </Button>]}
            >
                {addModalContent}
            </Modal>
            <div className="w-full h-screen pt-[1rem]  bg-gray-100 text-center">
                <Table
                    dataSource={experiments}
                    columns={columns}
                    className="w-[95%] mx-auto" pagination={{
                        style: { visibility: "hidden" },
                    }}
                    scroll={{
                        y: 500,
                    }}
                />
                <Button className="mt-5" onClick={() => {
                    showModal()
                    // addExperiment({
                    //     ExperimentNo: "7",
                    //     Experiment_Name: "a sample experiment",
                    //     Description: "sample description",
                    //     Due_Date: new Date()
                    // })
                }}>Add Experiment</Button>
            </div>
        </Spin>
    );
};
export default Experiments;
