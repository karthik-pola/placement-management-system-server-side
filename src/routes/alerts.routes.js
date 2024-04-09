import { Router } from "express";
import {createAlert, deleteAlert, getAlerts } from "../controllers/alerts.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/create").post(verifyJWT , createAlert)

router.route("/").get(getAlerts)

router.route("/delete/:alert_id").delete(deleteAlert)

export default router