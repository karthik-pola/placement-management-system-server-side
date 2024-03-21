import { Router } from "express";
import {createAlert, deleteAlert, getAlerts } from "../controllers/alerts.controller.js";


const router = Router()

router.route("/create").post(createAlert)

router.route("/").get(getAlerts)

router.route("/delete/:alert_id").delete(deleteAlert)

export default router