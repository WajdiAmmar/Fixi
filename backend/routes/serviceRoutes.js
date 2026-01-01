import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
  getRandomServices,
} from "../controllers/serviceController.js";

const router = express.Router();

// CRUD services
router.post("/", createService);
router.get("/", getServices);
router.get("/random", getRandomServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
