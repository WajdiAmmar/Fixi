import React, { useState,useEffect } from "react";
import { X, Send, User, Mail, Phone, MapPin, FileText } from "lucide-react";

const RequestModal = ({ isOpen, onClose, artisanId, artisanName, currentUser, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

useEffect(() => {
    console.log(currentUser)
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || ""
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation des champs requis
      if (!formData.fullName.trim()) {
        throw new Error("Le nom complet est requis");
      }
      
      if (!formData.email.trim()) {
        throw new Error("L'email est requis");
      }
      
      if (!formData.phone.trim()) {
        throw new Error("Le téléphone est requis");
      }
      
      if (!formData.description.trim()) {
        throw new Error("La description du projet est requise");
      }

      // Validation email simple (vérifie juste qu'il y a un @)
      if (!formData.email.includes('@')) {
        throw new Error("Veuillez entrer une adresse email valide");
      }

      // Préparer les données pour l'envoi
      const requestData = {
        userId: currentUser.id,
        artisanId: artisanId,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        description: formData.description
      };

      // Vérification finale des données obligatoires pour le backend
      if (!requestData.userId) {
        throw new Error("Utilisateur non identifié. Veuillez vous connecter.");
      }

      // Appeler la fonction onSubmit passée en prop
      await onSubmit(requestData);
      
      setSuccess(true);
      
      // Fermer le modal après 2 secondes
      setTimeout(() => {
        onClose();
        setSuccess(false);
        // Réinitialiser le formulaire mais garder les infos utilisateur
        if (currentUser) {
          setFormData({
            fullName: currentUser.fullName || currentUser.name || "",
            email: currentUser.email || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
            description: ""
          });
        } else {
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            address: "",
            description: ""
          });
        }
      }, 2000);

    } catch (error) {
      setError(error.message || "Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header du modal */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#003366] to-[#004080] text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Envoyer une demande</h2>
              <p className="text-blue-100 mt-1">
                à {artisanName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenu du formulaire */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Demande envoyée !</h3>
              <p className="text-gray-600">
                Votre demande a été envoyée avec succès à {artisanName}.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Vous serez contacté dans les plus brefs délais.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Nom complet */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <User className="w-4 h-4 mr-2 text-[#FF6B35]" />
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Mail className="w-4 h-4 mr-2 text-[#FF6B35]" />
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <Phone className="w-4 h-4 mr-2 text-[#FF6B35]" />
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ex: 06 12 34 56 78 ou 0612345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                    required
                  />
                </div>

                {/* Adresse */}
                <div className="space-y-2">
                  <label className="flex items-center text-gray-700 font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-[#FF6B35]" />
                    Adresse (facultatif)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Votre adresse"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="flex items-center text-gray-700 font-medium mb-2">
                  <FileText className="w-4 h-4 mr-2 text-[#FF6B35]" />
                  Description de votre projet *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre projet en détail (nature des travaux, surface, délais, budget approximatif, etc.)"
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent transition-all resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Plus votre description est précise, plus l'artisan pourra vous répondre efficacement.
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004080] text-white font-medium rounded-xl hover:from-[#004080] hover:to-[#003366] transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestModal;