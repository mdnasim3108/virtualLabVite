import { Button, Dropdown, notification } from "antd";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import userContext from "../../../contextStore/context";
import { useNavigate, useParams } from "react-router";
import { api as strapiApi } from "../../../constants";
const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams("id");
  const [codeid, setcodeid] = useState("");
  const {
    experiments,
    selected,
    setSelected,
    user,
    progressUpdateHandler,
    progress,
    submission,
    setSubmission,
  } = useContext(userContext);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
    });
  };
  const ExperimentIndex = experiments.findIndex(
    (experiment) => experiment.expNo == id
  );

  useEffect(() => {
    if (experiments.length) {
      const ExpIndex = experiments.findIndex(
        (experiment) => experiment.expNo == id
      );
      setSelected({
        name: experiments[ExpIndex].expTitle,
        no: +experiments[ExpIndex].expNo,
      });
    }
  }, [experiments, id]);

  useEffect(() => {
    if (progress.progressData.length) {
      const index = progress.progressData.findIndex(
        (el) => el.experiment == id
      );
      if (index >= 0) setcodeid(progress.progressData[index].codeId);
      else setcodeid("12345");
    } else setcodeid("12345");
  }, [progress, id]);

  const [loading, setLoading] = useState({save:false,submit:false});
  const submittedExperiments = submission.Experiments.map((el) => el.ExpNo);

  const items = experiments
    .filter((el) => !submittedExperiments.includes(+el.expNo))
    .map((exp) => {
      return {
        key: exp.key,
        label: (
          <p
            onClick={() => {
              setSelected({ name: exp.expTitle, no: exp.expNo });
              navigate(`/editor/${exp.expNo}`);
            }}
          >
            {exp.expTitle}
          </p>
        ),
      };
    });
  const [code, setCode] = useState({ content: "", id: "" });
  const [out, setOut] = useState("");

  window.onmessage = function (e) {
    if (e.data && e.data.language) {
      console.log(e);
      if (e.data.result) {
        setOut(e.data.result.output);
      }
      setCode({ content: e.data.files[0].content, id: e.data._id });
    }
  };

  const saveProgressHandler = async() => {
    {
      if (code.id === "") {
        openNotificationWithIcon(
          "warning",
          "Nothing to save",
          "Everything up to date"
        );
        return;
      }
      setLoading({submit:false,save:true})
      var iFrame = document.getElementById("oc-editor");
      iFrame.contentWindow.postMessage(
        {
          eventType: "triggerRun",
        },
        "*"
      );

      await progressUpdateHandler(selected.no, code.id);
      openNotificationWithIcon(
        "success",
        "Progress saved",
        "Your progress has been saved sucessfully"
      );
        setLoading({submit:false,save:false})
    }
  };

  const submitHandler = async () => {
    if (code.content === "" || out === "") {
      openNotificationWithIcon(
        "warning",
        "Output required",
        "Run the code atleast once to submit your code"
      );
      return;
    }
    setLoading({submit:true,save:false})
    if (submission.Experiments.length) {
      console.log(code.content);
      axios
        .put(`${strapiApi}/submissions/${submission.id}?populate=*`, {
          data: {
            Experiments: [
              ...submission.Experiments,
              {
                record: null,
                output: null,
                viva: null,
                total: null,
                ExpNo: selected.no,
                code: code.content,
                outputContent: out,
                Submitted_Date: new Date(),
              },
            ],
          },
        })
        .then((res) => {
          setSubmission({
            id: res.data.data.id,
            Experiments: res.data.data.attributes.Experiments,
          });
          openNotificationWithIcon(
            "success",
            "Work submitted",
            "Your work had been submitted sucessfully"
          );
          setLoading({submit:false,save:false})
        });
    } else {
      axios
        .post(`${strapiApi}/submissions?populate=*`, {
          data: {
            roll: user.roll,
            Experiments: [
              {
                ExpNo: selected.no,
                code: code.content,
                outputContent: out,
                Submitted_Date: new Date(), 
              },
            ],
          },
        })
        .then((res) => {
          setSubmission({
            id: res.data.data.id,
            Experiments: res.data.data.attributes.Experiments,
          });
          openNotificationWithIcon(
            "success",
            "Work submitted",
            "Your work had been submitted sucessfully"
          );
          setLoading({submit:false,save:false})
        });
    }
  };
  return !(codeid === "") ? (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[93%] relative">
        {contextHolder}
        <p className="text-lg font-semi-bold absolute top-[1.4vh] left-[30%]">
          {experiments[ExperimentIndex]?.expTitle}
        </p>

        <iframe
          id="oc-editor"
          frameBorder="0"
          height="450px"
          src={`https://onecompiler.com/embed/python${
            codeid === "12345" ? "" : "/" + codeid
          }?codeChangeEvent=true&hideTitle=true&listenToEvents=true`}
          width="100%"
          className="h-full"
        ></iframe>
      </div>
      <div className="w-full h-[7%] flex items-center justify-center  bg-white z-10 shadow-lg border-t-2">
        <button
          disabled={loading.submit || loading.save}
          className={`text-white ${
            loading.submit ? "bg-gray-300" : "bg-violet-700"
          } transition-all duration-300 ease-in-out  font-medium rounded shadow-lg border text-sm w-[7rem] py-2 me-2  focus:outline-none`}
          onClick={submitHandler}
        >
          {loading.submit ? "Submitting" : "Submit code"}
        </button>

        <button
          disabled={loading.save || loading.submit}
          className={`text-white ${
            loading.save ? "bg-gray-300" : "bg-blue-700"
          } transition-all duration-300 ease-in-out  font-medium rounded border text-sm w-[7rem] py-2 me-2  focus:outline-none`}
          onClick={saveProgressHandler}
        >
          {loading.save ? "Saving.." : "Save progress"}
        </button>

        <Dropdown menu={{ items }}>
          <Button className="bg-gray-600 h-[2.2rem] pt-[6px] me-2 text-white hover:text-white">
            {experiments[ExperimentIndex]?.expTitle}
            <UpOutlined className=" w-5 ml-1 relative bottom-[2px] text-white" />
          </Button>
          {/* <button
            className={`text-white flex items-center bg-gray-600 transition-all  duration-300 ease-in-out  font-medium rounded border text-sm w-[10rem] py-2 me-2  focus:outline-none`}
          >
            {experiments[ExperimentIndex]?.expTitle}
            <UpOutlined className=" w-5 ml-1 mb-1 text-white" />
          </button> */}
        </Dropdown>
      </div>
    </div>
  ) : (
    <p>loading</p>
  );
};
export default Editor;
