import { Button, Dropdown, notification } from "antd";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import userContext from "../../../contextStore/context";
import { useNavigate, useParams } from "react-router";
import { api as strapiApi } from "../../../constants";
import { sha256 } from "crypto-hash";
const Editor = () => {
  const navigate = useNavigate();
  const { id } = useParams("id");
  const [codeid, setcodeid] = useState("");
  const [items, setItems] = useState([]);
  const {
    experiments,
    selected,
    setSelected,
    user,
    progressUpdateHandler,
    progress,
    submission,
    setSubmission,
    submissionsData,
    UserSelectedLab,
  } = useContext(userContext);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: "top",
    });
  };
  const [name,setName]=useState("")
  useEffect(() => {
    if (experiments.length && UserSelectedLab) {
      console.log(experiments);
      console.log(UserSelectedLab);
      setItems(experiments
        .filter((exp) => exp.lab == UserSelectedLab.code)
        .map((exp) => {
          return {
            key: exp.key,
            label: (
              <p
                onClick={() => {
                  setSelected({ name: exp.expTitle, no: exp.expNo });
                  navigate(`/editor/${exp.expNo}`)
                }}
              >
                {exp.expTitle}
              </p>
            ),
          };
        }))
      const ExpIndex = experiments.findIndex(
        (experiment) =>
          experiment.expNo == id && experiment.lab == UserSelectedLab.code
      );
      if(ExpIndex==-1) {
        navigate(`/editor/1`)  //no experiment found for the default selected laboratory
        return
      }
      setName(experiments[ExpIndex].expTitle)
      setSelected({
        name: experiments[ExpIndex].expTitle,  
        no: +experiments[ExpIndex].expNo,
      });
    }
  }, [experiments, id, UserSelectedLab]);

  useEffect(() => {
    if (progress.progressData.length && UserSelectedLab) {
      const index = progress.progressData.findIndex(
        (el) => el.experiment == id && el.labCode==UserSelectedLab.code
      );
      if (index >= 0) setcodeid(progress.progressData[index].codeId);
      else setcodeid("12345");
    } else setcodeid("12345");
  }, [progress, id,UserSelectedLab]);



  const [loading, setLoading] = useState({ save: false, submit: false });


  const [code, setCode] = useState({ content: "", id: "" });
  const [out, setOut] = useState("");

  window.onmessage = function (e) {
    if (e.data && e.data.language) {
      if (e.data.result) {
        setOut(e.data.result.output);
      }
      setCode({ content: e.data.files[0].content, id: e.data._id });
    }
  };

  const saveProgressHandler = async () => {
    {
      if (code.id === "") {
        openNotificationWithIcon(
          "warning",
          "Nothing to save",
          "Everything up to date"
        );
        return;
      }
      setLoading({ submit: false, save: true });
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
      setLoading({ submit: false, save: false });
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
    const hash = await sha256(code.content);
    const hashOfSubmissions = submissionsData
      .map((submission) =>
        submission.finishedExperiments.map((exp) => exp.hash)
      )
      .flat();
    if (hashOfSubmissions.includes(hash)) {
      openNotificationWithIcon(
        "warning",
        "Plagiarized code",
        "The code has been found plagiarized,Check your content for originality!"
      );
      return;
    }
    setLoading({ submit: true, save: false });
    if (submission.Experiments.length) {
      console.log(UserSelectedLab.code)
      console.log(submission);
      console.log(id);
      if (
        submission.Experiments.filter((exp) => exp.lab == UserSelectedLab.code)
          .map((e) => e.ExpNo)
          .includes(+id)
      ) {
        const submissionIndex = submission.Experiments.findIndex(
          (e) => e.ExpNo == id && e.lab == UserSelectedLab.code
        );
        console.log(UserSelectedLab.code);
        submission.Experiments[submissionIndex] = {
          record: null,
          output: null,
          viva: null,
          total: null,
          ExpNo: selected.no,
          code: code.content,
          hash,
          outputContent: out,
          Submitted_Date: new Date(),
          lab: UserSelectedLab.code,
        };
        axios
          .put(`${strapiApi}/submissions/${submission.id}?populate=*`, {
            data: {
              id: submission.id,
              Experiments: submission.Experiments,
            },
          })
          .then((res) => {
            setSubmission({
              id: res.data.data.id,
              Experiments: res.data.data.attributes.Experiments,
            });
            openNotificationWithIcon(
              "success",
              "Work updated",
              "Your work had been updated successfully"
            );

            setLoading({ submit: false, save: false });
          });
      } else {
        axios
          .put(`${strapiApi}/submissions/${submission.id}?populate=*`, {
            data: {
              id: submission.id,
              Experiments: [
                ...submission.Experiments,
                {
                  record: null,
                  output: null,
                  viva: null,
                  total: null,
                  ExpNo: selected.no,
                  code: code.content,
                  hash,
                  outputContent: out,
                  Submitted_Date: new Date(),
                  lab: UserSelectedLab.code,
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

            setLoading({ submit: false, save: false });
          });
      }
    } else {
      axios
        .post(`${strapiApi}/submissions?populate=*`, {
          data: {
            roll: user.roll,
            Experiments: [
              {
                record: null,
                output: null,
                viva: null,
                total: null,
                ExpNo: selected.no,
                code: code.content,
                outputContent: out,
                hash,
                Submitted_Date: new Date(),
                lab: UserSelectedLab.code,
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
          setLoading({ submit: false, save: false });
        });
    }
  };
  return !(codeid === "") ? (
    <div className="w-full h-[100vh]">
      <div className="w-full h-[93%] relative">
        {contextHolder}
        <p className="text-lg font-semi-bold absolute top-[1.4vh] left-[30%]">
          {name}
        </p>

        <iframe
          id="oc-editor"
          frameBorder="0"
          height="450px"
          src={`https://onecompiler.com/embed/c${
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
          <Button className="bg-gray-600 h-[2.2rem] pt-[6px] me-2 text-white font-medium">
            {name}
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
