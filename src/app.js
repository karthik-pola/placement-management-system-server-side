import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';



const app = express();
//const server = http.createServer(app);
//const io = new Server(server);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true ,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//yesh


//routes

import userRouter from './routes/user.routes.js';
import drivesRouter from './routes/drives.routes.js';
import resourseRouter from './routes/resource.routes.js';
import adminRouter from './routes/admin.routes.js';
import placedRouter from './routes/placed.routes.js';
import alertRouter from '../src/routes/alerts.routes.js'
import helpRouter from '../src/routes/help.routes.js'

//routes declaration
app.use("/api/v1/user", userRouter)
app.use("/api/v1/drives",drivesRouter)
app.use("/api/v1/resources", resourseRouter)
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/placedData",placedRouter)
app.use("/api/v1/alerts",alertRouter)
app.use("/api/v1/help" , helpRouter)


export {app}
