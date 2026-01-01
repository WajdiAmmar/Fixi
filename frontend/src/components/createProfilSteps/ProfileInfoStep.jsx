// components/ProfileInfoStep.jsx
import { useState, useEffect } from "react";
import { getServices } from "../../services/serviceService";

const ProfileInfoStep = ({ formData, setFormData, onNext }) => {
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const servicesData = await getServices();
      setServices(servicesData);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email invalide";

    if (!formData.phone) newErrors.phone = "Le téléphone est requis";
    if (!formData.artisan_type)
      newErrors.artisan_type = "Le type d'artisan est requis";
    if (!formData.serviceId) newErrors.serviceId = "Le service est requis";
    if (!formData.profile_name)
      newErrors.profile_name = "Le nom du profil est requis";

    // Validation des expériences professionnelles
    if (formData.experiences.length === 0) {
      newErrors.experiences = "Au moins une expérience professionnelle est requise";
    } else {
      // Validation de chaque expérience
      formData.experiences.forEach((exp, index) => {
        if (!exp.title) {
          newErrors[`experience_title_${index}`] = "Le titre du poste est requis";
        }
        if (!exp.years || exp.years < 1) {
          newErrors[`experience_years_${index}`] = "Le nombre d'années doit être d'au moins 1";
        }
        if (!exp.description) {
          newErrors[`experience_description_${index}`] = "La description est requise";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { title: "", years: "", description: "" },
      ],
    }));
  };

  const removeExperience = (index) => {
    const updated = formData.experiences.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experiences: updated }));
    
    // Clear errors related to the removed experience
    const newErrors = { ...errors };
    delete newErrors[`experience_title_${index}`];
    delete newErrors[`experience_years_${index}`];
    delete newErrors[`experience_description_${index}`];
    setErrors(newErrors);
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experiences];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, experiences: updated }));

    // Clear error when user starts typing in experience field
    const errorKey = `experience_${field}_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">
        Informations du Profil
      </h2>

      <div className="space-y-4">
        {/* Nom du profil */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Nom du profil *
          </label>
          <input
            type="text"
            name="profile_name"
            value={formData.profile_name || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.profile_name
                ? "border-red-500 focus:ring-red-500"
                : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="Nom de votre profil professionnel"
          />
          {errors.profile_name && (
            <p className="text-red-500 text-sm mt-1">{errors.profile_name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="Votre numéro de téléphone"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Type d'artisan */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Type d'artisan *
          </label>
          <select
            name="artisan_type"
            value={formData.artisan_type || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.artisan_type
                ? "border-red-500 focus:ring-red-500"
                : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
          >
            <option value="">Sélectionnez un type</option>
            <option value="plombier">Plombier</option>
            <option value="electricien">Électricien</option>
            <option value="menuisier">Menuisier</option>
            <option value="peintre">Peintre</option>
            <option value="maçon">Maçon</option>
            <option value="autre">Autre</option>
          </select>
          {errors.artisan_type && (
            <p className="text-red-500 text-sm mt-1">{errors.artisan_type}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Service *
          </label>
          <select
            name="serviceId"
            value={formData.serviceId || ""}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.serviceId
                ? "border-red-500 focus:ring-red-500"
                : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
          >
            <option value="">Sélectionnez un service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="text-red-500 text-sm mt-1">{errors.serviceId}</p>
          )}
        </div>

        {/* Années d'expérience */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Années d'expérience
          </label>
          <input
            type="number"
            name="experience_years"
            value={formData.experience_years || ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-[#C0C0C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            placeholder="0"
          />
        </div>

        {/* Expérience Professionnelle */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-[#003366]">
              Expériences Professionnelles *
            </h3>
            {errors.experiences && (
              <p className="text-red-500 text-sm">{errors.experiences}</p>
            )}
          </div>

          {formData.experiences.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                Vous devez ajouter au moins une expérience professionnelle.
              </p>
            </div>
          )}

          {formData.experiences.map((exp, index) => (
            <div
              key={index}
              className="border border-[#C0C0C0] p-4 rounded-lg mb-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-[#003366]">
                  Expérience {index + 1}
                </h4>
                {formData.experiences.length > 1 && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Supprimer
                  </button>
                )}
              </div>

              {/* Titre du poste */}
              <div className="mb-3">
                <label className="block text-sm text-[#003366] font-medium mb-1">
                  Titre du poste *
                </label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[`experience_title_${index}`]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#C0C0C0] focus:ring-[#003366]"
                  }`}
                  placeholder="Exemple : Menuisier"
                />
                {errors[`experience_title_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`experience_title_${index}`]}
                  </p>
                )}
              </div>

              {/* Années */}
              <div className="mb-3">
                <label className="block text-sm text-[#003366] font-medium mb-1">
                  Années *
                </label>
                <input
                  type="number"
                  min="1"
                  value={exp.years}
                  onChange={(e) => updateExperience(index, "years", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[`experience_years_${index}`]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#C0C0C0] focus:ring-[#003366]"
                  }`}
                  placeholder="2"
                />
                {errors[`experience_years_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`experience_years_${index}`]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-[#003366] font-medium mb-1">
                  Description *
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[`experience_description_${index}`]
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[#C0C0C0] focus:ring-[#003366]"
                  }`}
                  rows="3"
                  placeholder="Décrivez votre rôle, les tâches effectuées..."
                ></textarea>
                {errors[`experience_description_${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`experience_description_${index}`]}
                  </p>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addExperience}
            className="mt-3 bg-[#003366] text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
          >
            + Ajouter une expérience
          </button>
        </div>

        {/* Photo de profil */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Photo de profil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                profile_picture: e.target.files[0],
              }))
            }
            className="w-full px-3 py-2 border border-[#C0C0C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>

        {/* Bannière de profil */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Bannière de profil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                profile_banner: e.target.files[0],
              }))
            }
            className="w-full px-3 py-2 border border-[#C0C0C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-[#FF8C00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoStep;