import { Table, Button, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import PrimaryButton from "../../UI/Primarybutton";
import { LuMegaphone } from "react-icons/lu";
import { Input } from "antd";
import userContext from "../../../contextStore/context";
import axios from "axios";
import { api } from "../../../constants";
const FacultyAnnouncements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, announcements, setAnnouncements } = useContext(userContext);

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

  const announcementsData = announcements.map((announcement) => {
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
  });

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
        title="Announce Something..."
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
        dataSource={announcementsData}
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
        <PrimaryButton onClick={showModal} className="">
          Announce something
          <LuMegaphone className="inline text-lg ml-3" />
        </PrimaryButton>
      </div>
    </div>
  );
};
export default FacultyAnnouncements;
