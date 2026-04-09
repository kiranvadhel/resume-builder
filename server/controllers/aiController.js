import Resume from "../models/Resume.js";
import ai from "../config/ai.js";


export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert in resume writing. Enhance the professional summary.
Make it compelling, ATS-friendly, and return ONLY text.`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    res.status(200).json({ enhancedContent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: `Enhance job description in 1-2 lines with action verbs and achievements. ATS-friendly. Only return text.`,
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    res.status(200).json({ enhancedContent });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.user?.id;

    if (!resumeText) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "Extract structured resume data in JSON format only.",
        },
        {
          role: "user",
          content: `Extract data from this resume:\n${resumeText}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    let parsedData;

    try {
      parsedData = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      return res.status(400).json({ message: "AI response parsing failed" });
    }

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    res.status(200).json({ resumeId: newResume._id });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume: updatedResume });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};