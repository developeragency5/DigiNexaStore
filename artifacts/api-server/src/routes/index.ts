import { Router, type IRouter } from "express";
import healthRouter from "./health";
import { appsRouter } from "./apps";
import { categoriesRouter } from "./categories";
import { statsRouter } from "./stats";
import { personaRouter } from "./persona";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/apps", appsRouter);
router.use("/categories", categoriesRouter);
router.use("/stats", statsRouter);
router.use("/persona", personaRouter);

export default router;
