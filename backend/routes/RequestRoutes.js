import express from "express";
import {
  sendRequest,
  getAllRequests,
  getRequestsByUser,
  getRequestsByArtisan,
  updateRequestStatus
} from "../controllers/RequestController.js";

const router = express.Router();

// Envoyer une nouvelle demande (user)
router.post("/send", sendRequest);

// Récupérer toutes les demandes (admin ou debug)
router.get("/", getAllRequests);

// Récupérer les demandes d'un utilisateur spécifique
router.get("/user/:userId", getRequestsByUser);

// Récupérer les demandes d'un artisan spécifique
router.get("/artisan/:artisanId", getRequestsByArtisan);

// Mettre à jour le statut d'une demande (artisan ou admin)
router.patch("/status/:requestId", updateRequestStatus);

export default router;
