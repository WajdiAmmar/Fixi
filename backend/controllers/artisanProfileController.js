import ArtisanProfile from "../models/ArtisanProfile.js";
import mongoose from "mongoose";

// CREATE Artisan profile
export const createArtisanProfile = async (req, res) => {
  try {
    const {
      userId,
      serviceId,
      email,
      phone,
      artisan_type,
      experience_years,
      address,
      profile_name,
      professional_experiences,
    } = req.body;

    if (!professional_experiences || professional_experiences.length === 0) {
      return res.status(400).json({
        message: "Vous devez ajouter au moins une expérience professionnelle.",
      });
    }
    const experiences = JSON.parse(req.body.professional_experiences || "[]");

    const profile = new ArtisanProfile({
      userId,
      serviceId,
      email,
      phone,
      artisan_type,
      experience_years,
      address,
      profile_name,
      professional_experiences: experiences,
    });

    if (req.files.profile_picture) {
      profile.profile_picture = req.files.profile_picture[0].path;
    }

    if (req.files.profile_banner) {
      profile.profile_banner = req.files.profile_banner[0].path;
    }

    const saved = await profile.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all profiles
export const getAllArtisans = async (req, res) => {
  try {
    const profiles = await ArtisanProfile.find()
      .populate("userId")
      .populate("serviceId");
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET 5 random artisan profiles (light version)
export const getRandomArtisans = async (req, res) => {
  try {
    const artisans = await ArtisanProfile.aggregate([
      { $sample: { size: 5 } },
      {
        $project: {
          _id: 1,
          profile_picture: 1,
          profile_name: 1,
          artisan_type: 1,
        },
      },
    ]);

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET profile by ID
export const getArtisanById = async (req, res) => {
  try {
    const profile = await ArtisanProfile.findById(req.params.id)
      .populate("userId")
      .populate("serviceId");

    if (!profile) {
      return res.status(404).json({ message: "Profil artisan introuvable" });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE profile
export const updateArtisanProfile = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.files.profile_picture) {
      updateData.profile_picture = req.files.profile_picture[0].path;
    }
    if (req.files.profile_banner) {
      updateData.profile_banner = req.files.profile_banner[0].path;
    }

    const updated = await ArtisanProfile.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profil artisan introuvable" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE profile
export const deleteArtisanProfile = async (req, res) => {
  try {
    const deleted = await ArtisanProfile.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Profil artisan introuvable" });
    }

    res.json({ message: "Profil supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// CHECK if a user already has an artisan profile
export const checkUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await ArtisanProfile.findOne({ userId }, { id: 1 }); // ne retourne que l'id

    if (profile) {
      return res.json({ exists: true, profileId: profile.id });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getArtisansByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const artisans = await ArtisanProfile.aggregate([
      {
        $match: {
          serviceId: new mongoose.Types.ObjectId(serviceId),
        },
      },
      {
        $project: {
          _id: 1,
          profile_picture: 1,
          profile_name: 1,
          artisan_type: 1,
        },
      },
    ]);

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
