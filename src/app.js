import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true ,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())



//routes

import userRouter from './routes/user.routes.js';
import drivesRouter from './routes/drives.routes.js';
import resourseRouter from './routes/resource.routes.js';
import adminRouter from './routes/admin.routes.js';
import placedRouter from './routes/placed.routes.js';

//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/drives",drivesRouter)
app.use("/api/v1/resources", resourseRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/placedData",placedRouter)


export {app}