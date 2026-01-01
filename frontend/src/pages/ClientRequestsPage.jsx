import React, { useState, useEffect } from "react";
import Header from "../components/home/Header";
import { 
  getRequestsByUser
} from "../services/requestService";
import { 
  getResponsesByRequest 
} from "../services/responseService";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaClock,
  FaCalendar,
  FaUser,
  FaTools,
  FaSpinner,
  FaComment,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaPaperPlane
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ClientRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  const [responses, setResponses] = useState({});
  
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      loadRequests();
    } else {
      setLoading(false);
      setError("Vous devez être connecté pour voir vos demandes");
    }
  }, [userId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      console.log("Chargement des demandes pour userId:", userId);
      
      const data = await getRequestsByUser(userId);
      console.log("Demandes reçues:", data);
      
      setRequests(data);
      
      // Charger les réponses pour chaque demande
      const responsesData = {};
      for (const request of data) {
        try {
          const requestResponses = await getResponsesByRequest(request._id);
          responsesData[request._id] = requestResponses;
        } catch (err) {
          console.error(`Erreur chargement réponses pour ${request._id}:`, err);
          responsesData[request._id] = [];
        }
      }
      setResponses(responsesData);
      
    } catch (error) {
      console.error("Erreur détaillée:", error);
      setError(`Erreur lors du chargement des demandes: ${error.message || "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponses = async (request) => {
    setSelectedRequest(request);
    
    // Charger les réponses si pas déjà chargées
    if (!responses[request._id]) {
      try {
        const requestResponses = await getResponsesByRequest(request._id);
        setResponses(prev => ({ ...prev, [request._id]: requestResponses }));
      } catch (err) {
        console.error("Erreur chargement réponses:", err);
      }
    }
    
    setShowResponsesModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="mr-2" />;
      case "accepted":
        return <FaCheckCircle className="mr-2" />;
      case "rejected":
        return <FaTimesCircle className="mr-2" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "En attente de réponse";
      case "accepted":
        return "Demande acceptée";
      case "rejected":
        return "Demande refusée";
      default:
        return "Statut inconnu";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const navigateToArtisanProfile = (artisanId) => {
    navigate(`/artisan-profile/${artisanId}`);
  };

  // Afficher l'état de chargement
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24">
          <div className="flex flex-col justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#FF6B35] mb-4" />
            <p className="text-gray-600">Chargement de vos demandes...</p>
          </div>
        </div>
      </>
    );
  }

  // Afficher les erreurs
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24">
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-center">
                  <FaTimesCircle className="text-red-500 text-2xl mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Erreur</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={loadRequests}
                    className="px-4 py-2 bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A2B]"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />

      {/* Modal des réponses */}
      {showResponsesModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Réponses de l'artisan
                </h3>
                <button
                  onClick={() => {
                    setShowResponsesModal(false);
                    setSelectedRequest(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Informations de la demande */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-[#003366] mb-2">Votre demande</h4>
                <p className="text-gray-700">{selectedRequest.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <FaCalendar className="inline mr-1" />
                  Envoyée le {formatDate(selectedRequest.createdAt)}
                </div>
              </div>
              
              {/* Réponses */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  <FaComment className="inline mr-2 text-[#FF6B35]" />
                  Réponses reçues ({responses[selectedRequest._id]?.length || 0})
                </h4>
                
                {responses[selectedRequest._id] && responses[selectedRequest._id].length > 0 ? (
                  <div className="space-y-4">
                    {responses[selectedRequest._id].map((response, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#003366]">
                        <div className="flex items-start mb-3">
                          {response.artisanId?.profile_picture ? (
                            <img 
                              src={response.artisanId.profile_picture} 
                              alt={response.artisanId.profile_name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center mr-3">
                              <FaBuilding className="text-white" />
                            </div>
                          )}
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              {response.artisanId?.profile_name || "Artisan"}
                            </h5>
                            <p className="text-sm text-gray-500">
                              {response.artisanId?.artisan_type || "Professionnel"}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{response.message}</p>
                        <p className="text-xs text-gray-500">
                          <FaPaperPlane className="inline mr-1" />
                          Réponse envoyée le {formatDate(response.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaComment className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Aucune réponse pour le moment
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      L'artisan n'a pas encore répondu à votre demande
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setShowResponsesModal(false)}
                  className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244]"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6 pt-24">
        <div className="max-w-6xl mx-auto">
          {/* En-tête de la page */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Mes Demandes
            </h1>
            <p className="text-gray-600">
              Consultez l'historique de toutes vos demandes envoyées aux artisans
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Total des demandes</p>
                  <h3 className="text-2xl font-bold text-gray-900">{requests.length}</h3>
                </div>
                <FaEnvelope className="text-3xl text-[#FF6B35]" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">En attente</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === "pending").length}
                  </h3>
                </div>
                <FaClock className="text-3xl text-yellow-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Acceptées</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => r.status === "accepted").length}
                  </h3>
                </div>
                <FaCheckCircle className="text-3xl text-green-500" />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500">Avec réponses</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {requests.filter(r => responses[r._id]?.length > 0).length}
                  </h3>
                </div>
                <FaComment className="text-3xl text-blue-500" />
              </div>
            </div>
          </div>

          {/* Liste des demandes */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <FaEnvelope className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucune demande pour le moment
                </h3>
                <p className="text-gray-500 mb-6">
                  Vous n'avez pas encore envoyé de demande à des artisans
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-xl hover:bg-[#E55A2B] transition-all"
                >
                  Trouver un artisan
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      {/* Informations de la demande */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <div className="flex items-center mb-3">
                              <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center border ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                {getStatusText(request.status)}
                              </div>
                              {responses[request._id]?.length > 0 && (
                                <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center">
                                  <FaComment className="mr-1" />
                                  {responses[request._id].length} réponse{responses[request._id].length > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            
                            {/* Informations artisan */}
                            {request.artisanId && (
                              <div className="flex items-center mb-4">
                                {request.artisanId.profile_picture ? (
                                  <img 
                                    src={request.artisanId.profile_picture} 
                                    alt={request.artisanId.profile_name}
                                    className="w-12 h-12 rounded-full mr-3 border-2 border-gray-200"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center mr-3">
                                    <FaBuilding className="text-white text-xl" />
                                  </div>
                                )}
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {request.artisanId.profile_name || "Artisan"}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {request.artisanId.artisan_type || "Professionnel"}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500 mt-2 md:mt-0">
                            <FaCalendar className="inline mr-1" />
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        
                        {/* Description de la demande */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <FaTools className="mr-2 text-[#FF6B35]" />
                            Votre demande
                          </h4>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {request.description}
                          </p>
                        </div>
                        
                        {/* Vos informations */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaUser className="mr-2 text-gray-400" />
                            <span>{request.fullName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            <span>{request.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaPhone className="mr-2 text-gray-400" />
                            <span>{request.phone}</span>
                          </div>
                          {request.address && (
                            <div className="flex items-center text-gray-600 md:col-span-3">
                              <FaMapMarkerAlt className="mr-2 text-gray-400" />
                              <span>{request.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions côté client */}
                      <div className="flex flex-col space-y-3 lg:w-56">
                        {request.artisanId && (
                          <button
                            onClick={() => navigateToArtisanProfile(request.artisanId._id)}
                            className="w-full bg-[#003366] hover:bg-[#002244] text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all"
                          >
                            <FaBuilding className="mr-2" />
                            Voir le profil
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleViewResponses(request)}
                          className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition-all ${
                            responses[request._id]?.length > 0
                              ? "bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <FaComment className="mr-2" />
                          {responses[request._id]?.length > 0
                            ? `Voir les réponses (${responses[request._id].length})`
                            : "Voir les réponses"}
                        </button>
                        
                        {/* Option pour renvoyer une demande si refusée */}
                        {request.status === "rejected" && (
                          <button
                            onClick={() => navigate("/")}
                            className="w-full border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white py-3 px-4 rounded-lg flex items-center justify-center transition-all"
                          >
                            <FaPaperPlane className="mr-2" />
                            Trouver un autre artisan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Instructions */}
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-semibold text-[#003366] mb-3 flex items-center">
              <FaComment className="mr-2" />
              Comment suivre vos demandes ?
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="w-6 h-6 bg-yellow-100 text-yellow-800 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <FaClock className="text-sm" />
                </span>
                <span><strong className="text-yellow-800">En attente :</strong> L'artisan n'a pas encore répondu à votre demande</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <FaCheckCircle className="text-sm" />
                </span>
                <span><strong className="text-green-800">Acceptée :</strong> L'artisan a accepté votre demande et peut vous contacter</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <FaTimesCircle className="text-sm" />
                </span>
                <span><strong className="text-red-800">Refusée :</strong> L'artisan ne peut pas traiter votre demande actuellement</span>
              </li>
              <li className="flex items-start">
                <span className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <FaComment className="text-sm" />
                </span>
                <span><strong className="text-blue-800">Réponses :</strong> Cliquez sur "Voir les réponses" pour lire les messages des artisans</span>
              </li>
            </ul>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Conseil :</strong> Les artisans répondent généralement dans les 24-48 heures. Si vous n'avez pas de réponse après 3 jours, vous pouvez contacter un autre artisan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRequestsPage;