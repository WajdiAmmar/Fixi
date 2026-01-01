import express from "express";
import {
  createArtisanProfile,
  getAllArtisans,
  getArtisanById,
  updateArtisanProfile,
  deleteArtisanProfile,
  checkUserProfile,
  getRandomArtisans,getArtisansByServiceId
} from "../controllers/artisanProfileController.js";

import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "profile_banner", maxCount: 1 },
  ]),
  createArtisanProfile
);

router.get("/", getAllArtisans);


router.get("/random", getRandomArtisans);

router.get("/:id", getArtisanById);

router.put(
  "/:id",
  upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "profile_banner", maxCount: 1 },
  ]),
  updateArtisanProfile
);
router.get("/service/:serviceId", getArtisansByServiceId);
router.delete("/:id", deleteArtisanProfile);

router.get("/check/:userId", checkUserProfile);

export default router;
