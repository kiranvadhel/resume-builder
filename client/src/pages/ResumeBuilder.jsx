import React from "react";
import { useParams } from "react-router-dom";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: " ",
    title: " ",
    personal_info: {},
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  });

  const loadExistingResume = async () => {
    const resume = dummyResuumeData.find((resume) => resume._id === resumeId);

    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };

  return <div></div>;
};

export default ResumeBuilder;
