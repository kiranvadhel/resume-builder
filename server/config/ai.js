import dotenv from "dotenv";
dotenv.config();   

import OpenAI from "openai";

console.log("KEY:", process.env.OPENAI_API_KEY); // debug

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL
});

export default ai;