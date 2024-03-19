import { IoIosAddCircleOutline } from "react-icons/io";
import { Button, Upload, Modal, Input } from "antd";
import { useContext, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { api } from "../../../constants";
import useMessage from "../../../utils/message";
import userContext from "../../../contextStore/context";
const AddLab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [formData, setData] = useState({
    labCode: "",
    Semester: "",
    Name: "",
  });
  const { labCode, Semester, Name } = formData;
  const { contextHolder, success, error, warning } = useMessage();
  const { user,fetchLabs } = useContext(userContext);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const changeHandler = (e) => {
    setData({ ...formData, [e.target.id]: e.target.value });
  };
  const addExperimentHandler = async () => {
    if (!labCode.length || !Semester.length || !Name.length || !img) {
      warning("Fill all the required fields!");
      return;
    }
    axios
      .post(`${api}/labs`, { data: { ...formData, Faculty: user.username } })
      .then(async (res) => {
        const id = res.data.data.id;
        if (img) {
          const formData = new FormData();
          formData.append("files", img);
          formData.append("ref", "api::lab.lab");
          formData.append("refId", id);
          formData.append("field", "image");
          const res = await fetch(`${api}/upload`, {
            method: "POST",
            body: formData,
          });
          fetchLabs(null)
          console.log(res)
          success("Laboratory added sucessfully!")
          handleCancel()
        }
      })
      .catch((er) => error(er.message));
  };
  const addModalContent = (
    <form>
      <div>
        <label>Laboratory code</label>
        <Input
          placeholder="Laboratory code"
          id="labCode"
          onChange={changeHandler}
          required
          type="text"
          value={labCode}
        />
      </div>

      <div className="mt-3">
        <label>Semester</label>
        <Input
          placeholder="Enter the semester"
          id="Semester"
          onChange={changeHandler}
          value={Semester}
          required
        />
      </div>
      <div className="mt-3">
        <label>Laboratory Name</label>
        <Input
          placeholder="Enter the Name of the laboratory"
          id="Name"
          onChange={changeHandler}
          value={Name}
          required
        />
      </div>
      <div className=" w-full flex flex-col">
        <label className="mt-5">Laboratory Image</label>
        <input
          className="mt-4"
          id="files"
          type="file"
          onChange={(e) => {
            console.log(e.target.files[0]);
            setImg(e.target.files[0]);
          }}
        />
      </div>
    </form>
  );
  return (
    <>
      {contextHolder}
      <Modal
        title={"Create a new Laboratory "}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={addExperimentHandler}>
            Add
          </Button>,
        ]}
      >
        {addModalContent}
      </Modal>
      <button
        onClick={showModal}
        className="bg-black  w-full rounded mt-20 text-white font-bold text-2xl py-10 hover:opacity-[0.8] transition-all duration-75 ease-linear"
      >
        Add Lab
        <IoIosAddCircleOutline className="inline text-3xl ml-5" />
      </button>
    </>
  );
};
export default AddLab;
