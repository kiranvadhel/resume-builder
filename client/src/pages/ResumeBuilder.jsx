import { ArrowLeftIcon,FileText,FolderIcon,GraduationCap,Sparkles,User ,ChevronLeft, Share2Icon, EyeIcon, EyeOff, DownloadIcon } from "lucide-react";
import ResumePreview from "../components/ResumePreview";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PersonalInfoForm from "../components/PersonalInfoForm";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker"; 
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm"; 
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";


import api from "../configs/api";        
import toast from "react-hot-toast";    

const ResumeBuilder = () => {
  const { resumeId } = useParams()
  const { token } = useSelector((state) => state.auth)

  const [resumeData, setResumeData] = useState(null);
  //   {
  //   _id: "",
  //   title: "",
  //   personal_info: {},
  //   experience: [],
  //   education: [],
  //   project: [],
  //   skills: [],
  //   template: "classic",
  //   accent_color: "#3B82F6",
  //   public: false,
  // });

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const loadExistingResume = async () => {
  try {
    console.log(" API CALLED");
    console.log("PARAM ID:", resumeId);

    const { data } = await api.get('/resume/get/' + resumeId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // console.log(" FULL RESPONSE:", data);
    // console.log(" RESUME OBJECT:", data.resume);
    // console.log(" RESUME ID:", data.resume?._id);

    if (data.resume) {
      console.log(" SETTING RESUME DATA");
      setResumeData(data.resume);
    } else {
      console.log(" NO RESUME FOUND");
    }

  } catch (error) {
    console.log(" LOAD ERROR:", error.message);
  }
};

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: GraduationCap },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex]

 useEffect(() => {
  if (resumeId) {
    loadExistingResume();
  }
}, [resumeId]);

  const changeResumeVisibility = async () => {
  if (!resumeData._id) {
    toast.error("Resume not saved yet!");
    return;
  }

  try {
    const { data } = await api.put(
      "/resume/update",
      {
        resumeId: resumeData._id,
        title: resumeData.title || "Untitled Resume",
        isPublic: !resumeData.public, 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setResumeData({ ...resumeData, public: !resumeData.public });
    toast.success(data.message);
  } catch (error) {
    console.error("Error saving resume:", error);
    toast.error(error?.response?.data?.message || error.message);
  }
};
  const handleShare = () =>{
    const frontendUrl=window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;

    if(navigator.share){
      navigator.share({url:resumeUrl, text:"My Resume",})
    }else{
      alert('Share Not Supported On This Browser.')
    }
  }

  const downloadResume = ()=>{
    window.print();
  }

  
const saveResume = async () => {
  try {
    console.log(" FINAL resumeData:", resumeData);
    console.log(" resumeId:", resumeId);
    console.log(" resumeData._id:", resumeData?._id);

    const finalId = resumeData?._id || resumeId;

    if (!finalId) {
      console.log(" Missing ID");
      return;
    }

    console.log(" SENDING ID:", finalId);

    const response = await api.put(
      '/resume/update',
      {
        resumeId: finalId,
        resumeData: JSON.stringify(resumeData) 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = response.data;

    console.log(" RESPONSE:", data);

    if (data?.resume) {
      setResumeData(data.resume);
    }

  } catch (error) {
    console.error(" Error saving resume:", error.response?.data || error.message);
  }
};
    
console.log(" COMPONENT resumeId:", resumeId);
if (!resumeData) return <div>Loading...</div>;
  return (
    <div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
      
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          
          {/* left sidebar */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
            
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"></hr>

              <hr 
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000"
              style={{width:`${activeSectionIndex *100/(sections.length - 1)}%`}}
              ></hr>

              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className ='flex  items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev =>({...prev ,template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev =>({...prev ,accent_color: color}))}/>
                </div>

                <div className='flex items-center'>

                  {activeSectionIndex !== 0 && (
                    <button 
                    onClick={()=> setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1 , 0))} 
                    className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'>
                      <ChevronLeft className="size-4"/> Previous
                    </button>
                  )}

                  <button 
                  onClick={()=> setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1 , sections.length -1 ))} 
                  className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all
                    ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} 
                  disabled={activeSectionIndex === sections.length - 1}>
                    Next 
                    <ChevronLeft className="size-4"/> Previous
                  </button>

                </div>

              </div>

              <div className='space-y-6'>
  {activeSection.id === "personal" && (
    <PersonalInfoForm 
      data={resumeData.personal_info} 
      onChange={(data) =>
        setResumeData(prev => ({
          ...prev,
          personal_info: {
            ...prev.personal_info,
            ...data, 
          }
        }))
      } 
      removeBackground={removeBackground} 
      setRemoveBackground={setRemoveBackground} 
    />
  )}

                {activeSection.id === "summary" && (
                  <ProfessionalSummaryForm 
                  data={resumeData.professional_summary}
                  onChange={(data) => setResumeData(prev => ({...prev, professional_summary: data}))}
                  setResumeData={setResumeData}
                  />
                )}

                {activeSection.id === "experience" && (
                  <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) => setResumeData(prev => ({...prev, experience: data}))}
                  />
                )}

                {activeSection.id === "education" && (
                  <EducationForm
                  data={resumeData.education}
                  onChange={(data) => setResumeData(prev => ({...prev, education: data}))}
                  />
                )}

                {activeSection.id === "skills" && (
                  <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) => setResumeData(prev => ({...prev, skills: data}))}
                  />
                )}
              </div>

              <button 
                onClick={() =>
                  toast.promise(saveResume(), {
                    loading: "Saving...",
                    success: "Saved successfully",
                    error: "Save failed",
                  })
                }
                className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring
                hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>
             

            </div>
          </div>

          {/* right sidebar */}
          <div className='lg:col-span-7 max-lg:mt-6'>

            <div className='relative-w-full'>
              <div className='absolute top-25 right-20 flex items-center justify-end gap-2'>
                
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br
                   from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4'/> Share
                  </button>
                )}

                <button onClick={downloadResume} className="flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100
                 to-green-200 text-green-600 ring-green-300 rounded-lg ring-blue-300 hover:ring transition-colors">
                  <DownloadIcon className='size-4'/>Download
                </button>

              </div>
            </div>

            <ResumePreview 
              data={resumeData} 
              template={resumeData.template}
              accentColor={resumeData.accent_color} 
            />

          </div>

        </div>
      </div>

    </div>   
  );
};

export default ResumeBuilder;