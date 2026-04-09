import React, { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'  // ✅ import api

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector(state => state.auth)
  const [isGenerating, setIsGenerating] = useState(false)

  const generateSummary = async () => {
    try {
      setIsGenerating(true)
      const prompt = `enhance my professional "${data}"`;
      const response = await api.post(
        '/ai/enhance-pro-sum',
        { userContent: prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResumeData(prev => ({ ...prev, professional_summary: response.data.enhancedContent }))
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
          <p className='text-sm text-gray-600'>Add summary for your resume here</p>
        </div>
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          className='flex items-center gap-1 text-sm text-white bg-green-500 hover:bg-green-600 transition-all px-3 py-2 rounded-lg'
        >
          {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {isGenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none'
          placeholder='Write your professional summary here...'
        />
        <p className='text-sm text-gray-500 max-w-4/5 mx-auto text-center'>
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm