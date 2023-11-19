import { Table, Button, Modal } from "antd"
import { useState } from "react";
const Announcements = () => {
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
    const dataSource = [
        {
            key: "1",
            name: "mohamed nasim",
            subject: "postponement of exams",
            description: <Button onClick={showModal}>
                Description
            </Button>
        },
        {
            key: "2",
            name: "shameer",
            subject: "CompileX integration",
            description: <Button onClick={showModal}>
                Description
            </Button>
        },
        {
            key: "3",
            name: "Prof.R devi",
            subject: "Netsim manual",
            description: <Button onClick={showModal}>
                Description
            </Button>
        },

    ];
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
        <Modal title="Postponement of exams" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    close
                </Button>]}
        >
            <p>The descriptions of the announcement modal will be displayed here.</p>
        </Modal>
        <Table
            dataSource={dataSource}
            columns={columns}
            className="w-[95%] mx-auto relative bottom-6" pagination={{
                style: { visibility: "hidden" },
            }}
            scroll={{
                y: 450,
            }}
        />
    </div>
}
export default Announcements