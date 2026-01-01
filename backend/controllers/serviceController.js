import Service from "../models/Service.js";

// Créer un service
export const createService = async (req, res) => {
  try {
    console.log("Body reçu:", req.body);
    const { name, subServices } = req.body;
    const service = new Service({ name, subServices: subServices || [] });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lister tous les services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET 5 random services
export const getRandomServices = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const services = await Service.aggregate([
      { $sample: { size: limit } }
    ]);

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un service par ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un service
export const updateService = async (req, res) => {
  try {
    
    const { name, subServices } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, subServices },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
