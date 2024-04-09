import { Router } from "express";
import { createHelp, deleteHelp, getHelps } from "../controllers/help.controller.js";




const router = Router()

router.route("/create").post(createHelp)
router.route("/").post(getHelps)
router.route("/delete/:help_id").delete(deleteHelp)



export default router