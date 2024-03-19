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
  const [submissionsData, setSubmissionsData] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});
  const [labs, setLabs] = useState([]);
  const [UserSelectedLab, setUserSelectedLab] = useState(null);
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
    if (experiments.length && UserSelectedLab) {
      const UserSelectedLabExperiment = experiments.find(
        (exp) => exp.lab === UserSelectedLab.code
      );
      if (UserSelectedLabExperiment)
        setSelected({
          name: UserSelectedLabExperiment.expTitle,
          no: +UserSelectedLabExperiment.expNo,
        });
      else setSelected({});
    }
  }, [UserSelectedLab, experiments]);

  const progressUpdateHandler = async (no, codeId) => {
    let updated = [...progress.progressData];
    if (progress.progressData.length) {
      const id = updated.findIndex((el) => +el.experiment === no && el.labCode==UserSelectedLab.code);
      if (id >= 0) updated[id] = { ...updated[id], codeId };
      else updated = [...updated, { experiment: no.toString(), codeId,labCode:UserSelectedLab.code }];
      const res = await axios.put(
        `${api}/progresses/${progress.id}?populate=*`,
        { data: { progress: updated } }
      );
      console.log(res);
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
                labCode:UserSelectedLab.code
              },
            ],
          },
        })
        .then((res) => {
          console.log(res);
          setProgress({
            id: res.data.data.id,
            progressData: res.data.data.attributes.progress,
          });
        });
    }
  };

  const fetchSubmissionsData = () => {
    axios.get(`${api}/submissions?populate=*`).then((res) => {
      setSubmissionsData(
        res.data.data.map((el) => {
          return {
            id: el.id,
            roll: el.attributes.roll,
            finishedExperiments: el.attributes.Experiments,
          };
        })
      );
    });
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
      .then((res) => {
        console.log(res.data);
        setStudents(res.data);
      });
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
            lab: exp.attributes.labCode,
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
              facultyName: announcement.attributes.facultyName,
              lab: announcement.attributes.labCode,
            };
          })
        );
      }
    });
  };

  const fetchLabs = (semester = null) => {
    axios.get(`${api}/labs?populate=*`).then((res) => {
      const labData = !semester
        ? res.data.data.map((lab) => {
            return {
              faculty: lab.attributes.Faculty,
              name: lab.attributes.Name,
              semester: lab.attributes.Semester,
              labCode: lab.attributes.labCode,
              image: lab.attributes.image.data.attributes.url,
            };
          })
        : res.data.data
            .map((lab) => {
              return {
                faculty: lab.attributes.Faculty,
                name: lab.attributes.Name,
                semester: lab.attributes.Semester,
                labCode: lab.attributes.labCode,
                image: lab.attributes.image.data.attributes.url,
              };
            })
            .filter((lab) => lab.semester == semester);

      setLabs(labData);
      setUserSelectedLab({
        code: labData[0].labCode,
        semester: labData[0].semester,
        img: labData[0].image,
        name: labData[0].name,
      });

      const availableLabs = labData.filter((lab) => lab.semester === semester);
      setSelectedLab(availableLabs[0]);
    });
  };

  const fetchUser = async () => {
    const res = await axios.get(
      `${api}/users?filters[email][$eqi]=${cookies.get("user")}&populate=*`
    );
    fetchExperiments();
    fetchAnnouncements();
    setUser(res.data[0]);
    fetchSubmissionsData();
    fetchLabs(res.data[0].semester);
    fetchStudents();
    if (!(res.data[0].userRole === "Faculty")) {
      fetchProgress(res.data[0].roll);
      fetchSubmitted(res.data[0].roll);
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
    resetProcess,
    submissionsData,
    setSubmissionsData,
    labs,
    selectedLab,
    setSelectedLab,
    UserSelectedLab,
    setUserSelectedLab,
    fetchLabs,
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
