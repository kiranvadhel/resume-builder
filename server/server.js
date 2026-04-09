import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve("F:/resume-builder/server/.env")
});

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import UserRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js';

const app = express();
connectDB();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('server is live');
});

app.use('/api/users', UserRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});