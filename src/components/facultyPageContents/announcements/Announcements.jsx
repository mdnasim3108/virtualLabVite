import { Table, Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { LuMegaphone } from "react-icons/lu";
import { Input } from "antd";
import userContext from "../../../contextStore/context";
import axios from "axios";
import { api } from "../../../constants";
const FacultyAnnouncements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, announcements, setAnnouncements,UserSelectedLab } = useContext(userContext);
  const [announcementData,setAnnouncementData]=useState([])
  const [updateId, setUpdateId] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setData({
      Description: "",
      Subject: "",
    });
    setIsModalOpen(false);
    setUpdateId(null);
  };

  const handleCancel = () => {
    setData({
      Description: "",
      Subject: "",
    });
    setIsModalOpen(false);
    setUpdateId(null);
  };
  const [formData, setData] = useState({
    Description: "",
    Subject: "",
  });
  const changeHandler = (e) => {
    setData({ ...formData, [e.target.id]: e.target.value });
  };
  // console.log(UserSelectedLab)
  useEffect(()=>{
    if(UserSelectedLab){
      setAnnouncementData(announcements.filter(announcement=>announcement.lab===UserSelectedLab.code).map((announcement) => {
        return {
          ...announcement,
          description:
            announcement.description.slice(0, 75) +
            (announcement.description.length > 80 ? "..." : ""),
          Action: (
            <p
              className="underline cursor-pointer"
              onClick={() => {
                console.log(announcement);
                setUpdateId(announcement.key);
                showModal();
                setData({
                  Description: announcement.description,
                  Subject: announcement.subject,
                });
              }}
            >
              {" "}
              view or edit
            </p>
          ),
        };
      }))
    }
  },[UserSelectedLab,announcements])

  const updateHanlder = () => {
    axios
      .put(`${api}/announcements/${updateId}?populate=*`, {
        data: {
          subject: formData.Subject,
          description: formData.Description,
        },
      })
      .then((res) => {
        console.log(res);
        const updated = [...announcements];
        const index = announcements.findIndex(
          (announcement) => announcement.key == res.data.data.id
        );
        updated[index] = {
          ...updated[index],
          subject: res.data.data.attributes.subject,
          description: res.data.data.attributes.description,
        };
        setAnnouncements(updated);
        handleCancel();
      });
  };

  const submitHandler = () => {
    axios
      .post(`${api}/announcements?populate=*`, {
        data: {
          facultyName: user.username,
          subject: formData.Subject,
          description: formData.Description,
          date: new Date(),
          labCode:UserSelectedLab.code
        },
      })
      .then((res) => {
        console.log(res);
        setAnnouncements([
          ...announcements,
          {
            key: res.data.data.id,
            subject: res.data.data.attributes.subject,
            description: res.data.data.attributes.description,
            AnnouncedDate: res.data.data.attributes.date,
            lab:res.data.data.attributes.labCode
          },
        ]);
        handleCancel();
        setData({
          Description: "",
          Subject: "",
        });
      });
  };

  const modalContent = (
    <form>
      <div className="mt-3">
        <label>Subject</label>
        <Input
          placeholder="Subject"
          id="Subject"
          onChange={changeHandler}
          value={formData.Subject}
          required
        />
      </div>
      <div className="mt-3">
        <label>Description</label>
        <Input.TextArea
          className="pb-20"
          placeholder="Description"
          id="Description"
          onChange={changeHandler}
          value={formData.Description}
          required
        />
      </div>
    </form>
  );

  const columns = [
    {
      title: "subject",
      dataIndex: "subject",
      key: "subject",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: "AnnouncedDate",
      dataIndex: "AnnouncedDate",
      key: "AnnouncedDate",
      width: "20%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      width: "10%",
    },
  ];
  return (
    <div className="mt-10">
      <Modal
        title={"Announce Something for "+UserSelectedLab?.name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            onClick={!updateId ? submitHandler : updateHanlder}
          >
            {!updateId ? "submit" : "update"}
          </Button>,
        ]}
      >
        {modalContent}
      </Modal>
      <Table
        dataSource={announcementData}
        columns={columns}
        className="w-[95%] mx-auto relative bottom-6"
        pagination={{
          style: { visibility: "hidden" },
        }}
        scroll={{
          y: 400,
        }}
      />
      <div className="w-full text-center">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800  font-medium rounded text-sm px-5 py-2.5 me-2 mb-2  focus:outline-none"
          onClick={showModal}
        >
          Announce something
          <LuMegaphone className="inline text-lg ml-3" />
        </button>
      </div>
    </div>
  );
};
export default FacultyAnnouncements;
