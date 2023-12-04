import UserContext from "./context";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router";
import { api } from "../constants";
const ContextProvider = (props) => {
  const cookies = new Cookies();
  const [user, setUser] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [keys, setKeys] = useState([window.location.pathname]);
  const [selected, setSelected] = useState({
    name: "client server communication",
    no: 1,
  });
  const [progress, setProgress] = useState({ id: "", progressData: [] });
  const [selectedProgressId, setSelectedProgressId] = useState("");
  const [submission, setSubmission] = useState({ id: "", Experiments: [] });
  const [students, setStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const resetProcess = () => {
    setUser(null);
    setExperiments([]);
    setKeys([window.location.pathname]);
    setSelected({
      name: "client server communication",
      no: 1,
    });
    setProgress({ id: "", progressData: [] });
    setSelectedProgressId("");
    setSubmission({ id: "", Experiments: [] });
    setStudents([]);
  };
  useEffect(() => {
    if (selected.no && progress.length) {
      const index = progress.findIndex((el) => selected.no === +el.experiment);
      if (index >= 0) setSelectedProgressId(progress[index].codeId);
    }
  }, [selected, progress]);

  useEffect(() => {
    if (experiments.length && submission.Experiments.length) {
      const pendingExperiments = experiments.filter(
        (experiment) =>
          !submission.Experiments.map((el) => el.ExpNo).includes(
            +experiment.expNo
          )
      );
      setSelected({
        name: pendingExperiments[0].expTitle,
        no: pendingExperiments[0].expNo,
      });
    }
  }, [experiments, submission]);

  const progressUpdateHandler = async (no, codeId) => {
    let updated = [...progress.progressData];
    if (progress.progressData.length) {
      const id = updated.findIndex((el) => +el.experiment === no);
      if (id >= 0) updated[id] = { ...updated[id], codeId };
      else updated = [...updated, { experiment: no.toString(), codeId }];
      console.log(updated);
      const res = await axios.put(
        `${api}/progresses/${progress.id}?populate=*`,
        { data: { progress: updated } }
      );
      console.log(res)
      setProgress({
        id: progress.id,
        progressData: res.data.data.attributes.progress,
      });
    } else {
      axios
        .post(`${api}/progresses?populate=*`, {
          data: {
            roll: user.roll,
            progress: [
              {
                experiment: no.toString(),
                codeId,
              },
            ],
          },
        })
        .then((res) =>{
        console.log(res)
          setProgress({
            id: res.data.data.id,
            progressData: res.data.data.attributes.progress,
          })
        }
        );
    }
  };
  const fetchProgress = async (roll) => {
    const res = await axios.get(
      `${api}/progresses?filters[roll][$eqi]=${roll}&populate=*`
    );
    console.log("progress", res);
    if (res.data.data.length)
      setProgress({
        id: res.data.data[0].id,
        progressData: res.data.data[0].attributes.progress,
      });
  };

  const fetchSubmitted = (roll) => {
    axios
      .get(`${api}/submissions?filters[roll][$eqi]=${roll}&populate=*`)
      .then((res) => {
        if (res.data.data.length) {
          console.log(res.data.data[0].attributes.Experiments);

          setSubmission({
            id: res.data.data[0].id,
            Experiments: res.data.data[0].attributes.Experiments,
          });
        }
      });
  };

  const fetchStudents = () => {
    axios
      .get(`${api}/users?filters[userRole][$eqi]=student&populate=*`)
      .then((res) => setStudents(res.data));
  };

  const fetchExperiments = () => {
    axios.get(`${api}/experiments?populate=*`).then((res) =>
      setExperiments(
        res.data.data.map((exp) => {
          return {
            key: exp.id,
            expNo: exp.attributes.ExperimentNo,
            expTitle: exp.attributes.Experiment_Name,
            expDesc: exp.attributes.Description,
            Due: exp.attributes.Due_Date,
          };
        })
      )
    );
  };

  const fetchAnnouncements = () => {
    axios.get(`${api}/announcements?populate=*`).then((res) => {
      if (res.data.data.length) {
        setAnnouncements(
          res.data.data.map((announcement) => {
            return {
              key: announcement.id,
              subject: announcement.attributes.subject,
              description: announcement.attributes.description,
              AnnouncedDate: announcement.attributes.date,
              facultyName:announcement.attributes.facultyName
            };
          })
        );
      }
    });
  };

  const fetchUser = async () => {
    const res = await axios.get(
      `${api}/users?filters[email][$eqi]=${cookies.get("user")}&populate=*`
    );
    fetchExperiments();
    fetchAnnouncements();
    console.log(res.data);
    setUser(res.data[0]);
    console.log(res.data[0]);
    if (!(res.data[0].userRole === "Faculty")) {
      fetchProgress(res.data[0].roll);
      fetchSubmitted(res.data[0].roll);
    } else {
      fetchStudents();
    }
  };

  const contextValues = {
    user,
    setUser,
    experiments,
    setExperiments,
    keys,
    setKeys,
    selected,
    setSelected,
    progress,
    progressUpdateHandler,
    selectedProgressId,
    setSelectedProgressId,
    submission,
    setSubmission,
    students,
    fetchUser,
    announcements,
    setAnnouncements,
    resetProcess
  };

  useEffect(() => {
    if (cookies.get("user")) {
      fetchUser();
    }
  }, []);

  return (
    <UserContext.Provider value={contextValues}>
      {props.children}
    </UserContext.Provider>
  );
};
export default ContextProvider;
