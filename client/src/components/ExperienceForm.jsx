import { Briefcase, Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../configs/api"; // ensure correct import

const ExperienceForm = ({ data = [], onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);

  const addExperience = () => {
    const newExp = { company: "", position: "", start_date: "", end_date: "", description: "", is_current: false };
    onChange([...(data || []), newExp]);
  };

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updatedExperienceField = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

const generateDescription = async (index) => {
  setGeneratingIndex(index);
  const exp = data[index]; // ✅ correct reference

  const prompt = `Create a professional job description for ${exp.position} at ${exp.company}. Current description: "${exp.description}"`;

  try {
    const { data: responseData } = await api.post(
      "/ai/enhance-job-desc",
      { userContent: prompt },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    updatedExperienceField(index, "description", responseData.enhancedContent || "");
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message);
  } finally {
    setGeneratingIndex(-1);
  }
};
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Professional Experience</h3>
        <button onClick={addExperience} className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          <Plus className="size-4" /> Add Experience
        </button>
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No Work Experience Added Yet.</p>
          <p>Click "Add Experience" to get started.</p>
        </div>
      )}

      {data.map((exp, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex justify-between">
            <h4>Experience #{index + 1}</h4>
            <button onClick={() => removeExperience(index)} className="text-red-500 hover:text-red-700">
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updatedExperienceField(index, "company", e.target.value)} className="px-3 py-2 border rounded" />
            <input type="text" placeholder="Position" value={exp.position} onChange={(e) => updatedExperienceField(index, "position", e.target.value)} className="px-3 py-2 border rounded" />
            <input type="date" value={exp.start_date} onChange={(e) => updatedExperienceField(index, "start_date", e.target.value)} className="px-3 py-2 border rounded" />
            <input type="date" value={exp.end_date} onChange={(e) => updatedExperienceField(index, "end_date", e.target.value)} className="px-3 py-2 border rounded" disabled={exp.is_current} />
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={exp.is_current} onChange={(e) => updatedExperienceField(index, "is_current", e.target.checked)} />
            Currently Working Here
          </label>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label>Job Description</label>
              <button
                onClick={() => generateDescription(index)}
                disabled={generatingIndex === index || !exp.company || !exp.position}
                className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
              >
                {generatingIndex === index ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Enhance With AI
              </button>
            </div>
            <textarea
              value={exp.description}
              onChange={(e) => updatedExperienceField(index, "description", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded resize-none"
              placeholder="Describe your key responsibilities and achievements"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;