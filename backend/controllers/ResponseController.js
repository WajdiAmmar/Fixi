import Response from "../models/Response.js";
import mongoose from "mongoose";

// SEND a new response
export const sendResponse = async (req, res) => {
  try {
    const { requestId, artisanId, message } = req.body;

    if (!requestId || !artisanId || !message) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const response = new Response({
      requestId,
      artisanId,
      message
    });

    const savedResponse = await response.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all responses
export const getAllResponses = async (req, res) => {
  try {
    const responses = await Response.find()
      .populate("requestId", "fullName email description")
      .populate("artisanId", "profile_name profile_picture artisan_type");

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET responses by request
export const getResponsesByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const responses = await Response.find({ requestId: new mongoose.Types.ObjectId(requestId) })
      .populate("artisanId", "profile_name profile_picture artisan_type");

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET responses by artisan
export const getResponsesByArtisan = async (req, res) => {
  try {
    const { artisanId } = req.params;

    const responses = await Response.find({ artisanId: new mongoose.Types.ObjectId(artisanId) })
      .populate("requestId", "fullName email description");

    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
