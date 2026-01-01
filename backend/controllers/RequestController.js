import Request from "../models/Request.js";
import mongoose from "mongoose";

// SEND a new request
export const sendRequest = async (req, res) => {
  try {
    const {
      userId,
      artisanId,
      fullName,
      email,
      phone,
      address,
      description
    } = req.body;

    if (!fullName || !email || !phone || !description || !userId || !artisanId) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const request = new Request({
      userId,
      artisanId,
      fullName,
      email,
      phone,
      address,
      description
    });

    const savedRequest = await request.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("userId", "firstName lastName email")
      .populate("artisanId", "profile_name profile_picture artisan_type");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET requests by user
export const getRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await Request.find({ userId: new mongoose.Types.ObjectId(userId) })
      .populate("artisanId", "profile_name profile_picture artisan_type");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET requests by artisan profile
export const getRequestsByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;

    const requests = await Request.find({ artisanId: new mongoose.Types.ObjectId(artisanId) })
      .populate("userId", "firstName lastName email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE request status
export const updateRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Demande introuvable." });
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
