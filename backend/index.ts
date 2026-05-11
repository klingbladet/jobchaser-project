import 'dotenv/config';
import express from 'express';
import usersRouter from './routes/users';
import jobsRouter from './routes/jobs'
import cors from 'cors';

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.use('/users', usersRouter)
app.use('/jobs', jobsRouter)

app.listen(port, () => {console.log(`Servern körs på http://localhost:${port}'`)})
