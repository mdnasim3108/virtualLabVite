import { Button, Dropdown, notification } from "antd";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import userContext from "../../../contextStore/context";
import { useNavigate, useParams } from "react-router";
const Editor = () => {
  const navigate=useNavigate()
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

  useEffect(()=>{
      if(experiments.length){
      const ExpIndex=experiments.findIndex(experiment => experiment.expNo==id)
      setSelected({name:experiments[ExpIndex].expTitle,no:+(experiments[ExpIndex].expNo)})
      }
  },[experiments,selected])

  useEffect(() => {
    if(progress.progressData.length){
    const index = progress.progressData.findIndex((el) => el.experiment == id); 
    if (index >= 0) setcodeid(progress.progressData[index].codeId)
    else setcodeid("12345");
    }
    else setcodeid("12345");
  }, [progress,id]);


  const submittedExperiments=submission.Experiments.map((el)=>el.ExpNo)

  const items = experiments.filter(el=>!(submittedExperiments.includes(+(el.expNo)))).map((exp) => {
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
  });
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
  
  const submitHandler = async () => {
  
    if (code.content === "" || out === "") {
      openNotificationWithIcon(
        "warning",
        "Output required",
        "Run the code atleast once to submit your code"
      );
      return;
    }
    if (submission.Experiments.length) {
      
      axios
        .put(
          `http://localhost:1337/api/submissions/${submission.id}?populate=*`,
          {
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
                  Submitted_Date:new Date()
              }
              ],
            },
          }
        )
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
        });
    } else {
      axios
        .post(`http://localhost:1337/api/submissions?populate=*`, {
          data: {
            roll: user.roll,
            Experiments: [
              {
                ExpNo: selected.no,
                code: code.content,
                outputContent: out,
                Submitted_Date:new Date()
              },
            ],
          },
        })
        .then((res) =>{
          setSubmission({
            id: res.data.data.id,
            Experiments: res.data.data.attributes.Experiments,
          })
          openNotificationWithIcon(
            "success",
            "Work submitted",
            "Your work had been submitted sucessfully"
          );

        }
          
        );
    }
  };
  return (
   !(codeid==="")? <div className="w-full h-[100vh]">
      <div className="w-full h-[93%] relative">
        {contextHolder}
        <p className="text-lg font-semi-bold absolute top-[1.4vh] left-[30%]">
          {selected.name}
        </p>

        <iframe
          id="oc-editor"
          frameBorder="0"
          height="450px"
          src={`https://onecompiler.com/embed/python${codeid==="12345"?"":"/"+codeid}?codeChangeEvent=true&hideTitle=true&listenToEvents=true`}
          width="100%"
          className="h-full"
        ></iframe>
      </div>
      <div className="w-full h-[7%] flex items-center justify-center  bg-gray-200"> 
        <Button className="mr-2" onClick={submitHandler}>
          submit code
        </Button>
        <Button
          className="mr-2"
          onClick={() => {
            if (code.id === "") {
              openNotificationWithIcon(
                "warning",
                "Nothing to save",
                "Everything up to date"
              );
              return;
            }

            // if (out === "") {
            //     openNotificationWithIcon('warning', 'Output required', 'Run the code atleast once to save your progress')
            //     return
            // }

            var iFrame = document.getElementById("oc-editor");
            iFrame.contentWindow.postMessage(
              {
                eventType: "triggerRun",
              },
              "*"
            );

            progressUpdateHandler(selected.no, code.id);
            openNotificationWithIcon(
              "success",
              "Progress saved",
              "Your progress has been saved sucessfully"
            );
          }}
        >
          save progress
        </Button>
        <Dropdown menu={{ items }} >
          <Button className="">
            {selected.name}
            <UpOutlined className=" w-5 ml-1 mb-1 text-black" />  
          </Button>
        </Dropdown>
      </div>
    </div>:
    <p>loading</p>
  );
};
export default Editor;
