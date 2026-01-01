// components/AddressStep.jsx
import { useState } from "react";

const AddressStep = ({ formData, setFormData, onPrevious, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.address?.city) newErrors.city = "La ville est requise";
    if (!formData.address?.postal_code) newErrors.postal_code = "Le code postal est requis";
    if (!formData.address?.full_address) newErrors.full_address = "L'adresse complète est requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit();
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-[#003366] mb-6">Adresse</h2>
      
      <div className="space-y-4">
        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Ville *
          </label>
          <input
            type="text"
            name="city"
            value={formData.address?.city || ""}
            onChange={handleAddressChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.city ? "border-red-500 focus:ring-red-500" : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="Votre ville"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* Code postal */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Code postal *
          </label>
          <input
            type="text"
            name="postal_code"
            value={formData.address?.postal_code || ""}
            onChange={handleAddressChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.postal_code ? "border-red-500 focus:ring-red-500" : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="Votre code postal"
          />
          {errors.postal_code && <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>}
        </div>

        {/* Adresse complète */}
        <div>
          <label className="block text-sm font-medium text-[#003366] mb-1">
            Adresse complète *
          </label>
          <textarea
            name="full_address"
            value={formData.address?.full_address || ""}
            onChange={handleAddressChange}
            rows="3"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.full_address ? "border-red-500 focus:ring-red-500" : "border-[#C0C0C0] focus:ring-[#003366]"
            }`}
            placeholder="Votre adresse complète"
          />
          {errors.full_address && <p className="text-red-500 text-sm mt-1">{errors.full_address}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onPrevious}
          className="bg-[#C0C0C0] text-[#003366] px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
        >
          Précédent
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#FF8C00] text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-200"
        >
          Créer le profil
        </button>
      </div>
    </div>
  );
};

export default AddressStep;