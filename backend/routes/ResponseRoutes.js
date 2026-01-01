import express from "express";
import {
  sendResponse,
  getAllResponses,
  getResponsesByRequest,
  getResponsesByArtisan
} from "../controllers/ResponseController.js";

const router = express.Router();

// Route pour envoyer une réponse (artisan)
router.post("/send", sendResponse);

// Route pour récupérer toutes les réponses (admin ou debug)
router.get("/", getAllResponses);

// Route pour récupérer les réponses d'une demande spécifique
router.get("/request/:requestId", getResponsesByRequest);

// Route pour récupérer toutes les réponses d'un artisan
router.get("/artisan/:artisanId", getResponsesByArtisan);

export default router;
