import { GraduationCap ,Plus,Trash2} from "lucide-react";
import React from "react";

const EducationForm = ({ data, onChange }) => {
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
     
    };

    onChange([...(data || []), newEducation]);
  };

  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updatedEducationField = (index, institution, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [institution]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between ">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              Education
            </h3>
            <p className="text-sm text-gray-600">Add your Education Details</p>
          </div>

          <button
            onClick={addEducation}
            className="flex items-center gap-1 text-sm text-white bg-green-500 hover:bg-green-600 transition-all px-3 py-2 rounded-lg"
          >
            <Plus className="size-4 " />
            Add Eduation
          </button>
        </div>

        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No Education Added Yet.</p>
            <p>Click "Add Education" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((education, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h4>Education #{index + 1}</h4>

                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                {/*(Company Name) */}
                <div className="grid md:grid-cols-2 gap-3">
                  {/* Company Name */}
                  <input
                    value={education.institution || ""}
                    onChange={(e) =>
                      updatedEducationField(index, "institution", e.target.value)
                    }
                    type="text"
                    placeholder="Institution Name"
                    className="px-3 py-2 text-sm "
                  />

                  {/*  Title */}
                  <input
                    value={education.degree || ""}
                    onChange={(e) =>
                      updatedEducationField(index, "degree", e.target.value)
                    }
                    type="text"
                    placeholder="Degree"
                    className="px-3 py-2 text-sm "
                  />

                  {/* Field */}
                  <input
                    value={education.field || ""}
                    onChange={(e) =>
                      updatedEducationField(index, "field", e.target.value)
                    }
                    type="text"
                    className="px-3 py-2 text-sm "
                    placeholder="Field Of Study"
                  />

                  {/* Gratuation Date */}
                  <input
                    value={education.graduation_date || ""}
                    onChange={(e) =>
                      updatedEducationField(index, "graduation_date", e.target.value)
                    }
                    type="date"
                    className="px-3 py-2 text-sm "
                  />
                </div>

                <input
                  value={education.gpa || ""}
                  onChange={(e) =>
                    updatedEducationField(index, "gpa", e.target.value)
                  }
                  type="text"
                  className="px-3 py-2 text-sm "
                  placeholder="GPA (optional)"
                />

              
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationForm;
