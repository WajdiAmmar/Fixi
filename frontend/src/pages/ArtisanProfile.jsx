import React, { useEffect, useState } from "react";
import { getArtisanProfileById } from "../services/artisanProfileService";
import {
  MapPin,
  Phone,
  Mail,
  Wrench,
  Star,
  Calendar,
  Award,
  Edit,
} from "lucide-react";
import ArtisanHeader from "../components/artisanProfile/Header";
import { useParams } from "react-router-dom";

const ArtisanProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getArtisanProfileById(id);
        console.log("data :: ", data);
        setProfile(data);
        if (data && data._id) {
          localStorage.setItem("artisanProfileId", data._id);
          console.log("Artisan profile ID stored:", data._id);
        }
      } catch (error) {
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProfile();
    }
  }, [id]);

  // Fonction pour formater l'adresse
  const formatAddress = (address) => {
    if (typeof address === "string") return address;
    if (address && typeof address === "object") {
      return address.full_address || `${address.city}, ${address.postal_code}`;
    }
    return "Adresse non disponible";
  };

  const handleEditProfile = () => {
    // Navigation vers la page d'édition du profil
    console.log("Redirection vers l'édition du profil");
    // navigate("/artisan/profile/edit");
  };

  if (loading) {
    return (
      <>
        <ArtisanHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 pt-20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Chargement du profil...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ArtisanHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 pt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <ArtisanHeader />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 pt-20">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Aucun profil trouvé
            </h2>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore créé de profil artisan. Créez-en un pour
              commencer à recevoir des demandes.
            </p>
            <button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
              Créer mon profil
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <ArtisanHeader />

      <div className="p-4 md:p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Bouton d'édition */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleEditProfile}
              className="flex items-center space-x-2 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Edit className="w-4 h-4" />
              <span>Modifier le profil</span>
            </button>
          </div>

          {/* Header avec bannière */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
            {/* Bannière */}
            <div
              className="h-40 md:h-48 relative bg-cover bg-center"
              style={{
                backgroundImage: profile.profile_banner
                  ? `url(${profile.profile_banner})`
                  : "linear-gradient(to right, #003366, #004080)",
              }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Contenu du header */}
            <div className="px-6 md:px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center -mt-20 md:-mt-16">
                {/* Avatar */}
                <div className="relative mb-4 md:mb-0">
                  <img
                    src={profile.profile_picture || "/api/placeholder/128/128"}
                    alt={profile.profile_name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-white shadow-2xl object-cover bg-gray-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    <Star className="w-4 h-4 inline mr-1" />
                    Pro
                  </div>
                </div>

                {/* Informations principales */}
                <div className="md:ml-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                        {profile.profile_name}
                      </h1>
                      <p className="text-lg md:text-xl text-[#FF6B35] font-semibold mt-1">
                        {profile.serviceId?.name || profile.artisan_type}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="bg-[#003366] hover:bg-[#002244] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                        Partager le profil
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mt-4 text-lg leading-relaxed max-w-3xl">
                    {profile.description ||
                      `Artisan ${profile.artisan_type} avec ${
                        profile.experience_years
                      } ans d'expérience. Spécialisé dans ${
                        profile.serviceId?.name || "les services professionnels"
                      }.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Le reste du code reste identique... */}
          {/* Grid d'informations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Carte Contact */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#FF6B35] inline-block">
                Informations de contact
              </h2>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5 text-[#FF6B35] mr-3" />
                  <span className="text-gray-700 font-medium">
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Phone className="w-5 h-5 text-[#FF6B35] mr-3" />
                  <span className="text-gray-700 font-medium">
                    {profile.phone}
                  </span>
                </div>

                <div className="flex items-start p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <MapPin className="w-5 h-5 text-[#FF6B35] mr-3 mt-1" />
                  <span className="text-gray-700 font-medium flex-1">
                    {formatAddress(profile.address)}
                  </span>
                </div>
              </div>
            </div>

            {/* Carte Compétences */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#FF6B35] inline-block">
                Spécialités & Services
              </h2>

              <div className="flex flex-wrap gap-3">
                {/* Sous-services du service principal */}
                {profile.serviceId?.subServices?.map((service, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-[#003366] to-[#004080] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-transform hover:scale-105"
                  >
                    {service}
                  </span>
                ))}

                {/* Type d'artisan comme compétence supplémentaire */}
                <span className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg transition-transform hover:scale-105">
                  {profile.artisan_type}
                </span>
              </div>
            </div>

            {/* Carte Statistiques */}
            <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-[#FF6B35] inline-block">
                Statistiques
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-[#FF6B35] mr-3" />
                    <span className="text-gray-700 font-medium">
                      Expérience totale
                    </span>
                  </div>
                  <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {profile.experience_years} an
                    {profile.experience_years > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-[#FF6B35] mr-3" />
                    <span className="text-gray-700 font-medium">
                      Projets réalisés
                    </span>
                  </div>
                  <span className="bg-[#003366] text-white px-3 py-1 rounded-full text-sm font-bold">
                    {profile.projectsCount || "50+"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-[#FF6B35] mr-3" />
                    <span className="text-gray-700 font-medium">
                      Satisfaction clients
                    </span>
                  </div>
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {profile.satisfactionRate || "98%"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Expérience */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Wrench className="w-6 h-6 text-[#FF6B35] mr-3" />
              Expérience professionnelle
            </h2>

            <div className="space-y-6">
              {/* Expérience principale basée sur experience_years */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl shadow-md border-l-4 border-[#FF6B35] hover:shadow-lg transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#003366] transition-colors">
                    {profile.serviceId?.name ||
                      `Artisan ${profile.artisan_type}`}
                  </h3>
                  <span className="bg-[#003366] text-white px-4 py-2 rounded-full text-sm font-bold mt-2 md:mt-0 inline-flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {profile.experience_years} an
                    {profile.experience_years > 1 ? "s" : ""} d'expérience
                  </span>
                </div>
                {/* Afficher les expériences professionnelles */}
                {profile.professional_experiences &&
                profile.professional_experiences.length > 0 ? (
                  <div className="space-y-4">
                    {profile.professional_experiences.map((exp, index) => (
                      <div key={index} className="flex items-start">
                        {/* Icône de puce/tiret */}
                        <div className="flex-shrink-0 mt-1 mr-3">
                          <div className="w-2 h-2 bg-[#FF6B35] rounded-full"></div>
                        </div>

                        <div className="flex-1">
                          {/* Titre et entreprise */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <h4 className="font-bold text-gray-800">
                              {exp.title || "Poste non spécifié"}
                            </h4>
                          </div>
                          {/* Description */}
                          {exp.description && (
                            <p className="text-gray-600 mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          )}

                          {/* Années d'expérience spécifiques */}
                          {exp.years && (
                            <div className="mt-2">
                              <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                <Calendar className="w-3 h-3 mr-1" />
                                {exp.years} an{exp.years > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    Aucune expérience professionnelle détaillée n'a été ajoutée.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Sous-services détaillés */}
          {profile.serviceId?.subServices &&
            profile.serviceId.subServices.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-6 transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Wrench className="w-6 h-6 text-[#FF6B35] mr-3" />
                  Services détaillés
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.serviceId.subServices.map((service, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 p-4 rounded-xl border-l-4 border-[#003366] hover:bg-blue-100 transition-colors"
                    >
                      <h3 className="font-bold text-gray-900 flex items-center">
                        <Wrench className="w-4 h-4 text-[#FF6B35] mr-2" />
                        {service}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ArtisanProfile;
