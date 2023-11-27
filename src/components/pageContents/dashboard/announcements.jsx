import { Table, Button, Modal } from "antd"
import { useContext, useState } from "react";
import userContext from "../../../contextStore/context"
const Announcements = () => {
    const {announcements}=useContext(userContext)
    console.log(announcements)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const [selected,setSelected]=useState({subject:"",desc:""})
    const announcementData=announcements.map(announcement=>{
        return {
            key: announcement.key,
            name: announcement.facultyName,
            subject: announcement.subject,
            description: <Button onClick={()=>{
                showModal()
                setSelected({subject:announcement.subject,desc:announcement.description})}}>
                Description
            </Button>
        }
    })
    const columns = [
        {
            title: "name",
            dataIndex: "name",
            key: "name",
            width: "50%",
        },
        {
            title: "subject",
            dataIndex: "subject",
            key: "subject",
            width: "30%",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "20%",
        },
    ];
    return <div>
        <Modal title={selected.subject} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    close
                </Button>]}
        >   

            <p>{selected.desc}</p>
        </Modal>
        <Table
            dataSource={announcementData}
            columns={columns}
            className="w-[95%] mx-auto relative bottom-6" pagination={{
                style: { visibility: "hidden" },
            }}
            scroll={{
                y: 200,
            }}
        />
    </div>
}
export default Announcements