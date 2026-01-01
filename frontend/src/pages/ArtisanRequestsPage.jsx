import React, { useState, useEffect } from "react";
import ArtisanHeader from "../components/artisanProfile/Header";
import { 
  getRequestsByArtisan, 
  updateRequestStatus 
} from "../services/requestService";
import { 
  sendResponse,
  getResponsesByRequest 
} from "../services/responseService";
import { 
  FaCheck, 
  FaTimes, 
  FaComment, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaClock,
  FaCalendar,
  FaUser,
  FaTools,
  FaSpinner,
  FaEye,
  FaPaperPlane
} from "react-icons/fa";
import { useSelector } from "react-redux";

const ArtisanRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [sendingResponse, setSendingResponse] = useState(false);
  const [responses, setResponses] = useState({});
  
  const artisanId = localStorage.getItem("artisanProfileId");

  useEffect(() => {
    if (artisanId) {
      loadRequests();
    }
  }, [artisanId]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequestsByArtisan(artisanId);
      setRequests(data);
      
      // Charger les réponses pour chaque demande
      const responsesData = {};
      for (const request of data) {
        const requestResponses = await getResponsesByRequest(request._id);
        responsesData[request._id] = requestResponses;
      }
      setResponses(responsesData);
      
    } catch (error) {
      setError("Erreur lors du chargement des demandes");
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await updateRequestStatus(requestId, status);
      // Mettre à jour localement
      setRequests(prev => prev.map(req => 
        req._id === requestId ? { ...req, status } : req
      ));
      
      // Recharger si accepté pour voir la réponse
      if (status === "accepted") {
        const requestResponses = await getResponsesByRequest(requestId);
        setResponses(prev => ({ ...prev, [requestId]: requestResponses }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim()) {
      alert("Veuillez entrer un message");
      return;
    }

    try {
      setSendingResponse(true);
      await sendResponse({
        requestId: selectedRequest._id,
        artisanId,
        message: responseMessage
      });

      // Recharger les réponses
      const requestResponses = await getResponsesByRequest(selectedRequest._id);
      setResponses(prev => ({ ...prev, [selectedRequest._id]: requestResponses }));
      
      setResponseMessage("");
      setShowResponseModal(false);
      setSelectedRequest(null);
      
      alert("Réponse envoyée avec succès!");
    } catch (error) {
      console.error("Error sending response:", error);
      alert("Erreur lors de l'envoi de la réponse");
    } finally {
      setSendingResponse(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="mr-1" />;
      case "accepted":
        return <FaCheck className="mr-1" />;
      case "rejected":
        return <FaTimes className="mr-1" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <>
        <ArtisanHeader />
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 pt-24">
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="animate-spin text-4xl text-[#FF6B35]" />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <ArtisanHeader />

      {/* Modal de réponse */}
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Répondre à la demande
              </h3>
              
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700"><strong>Client:</strong> {selectedRequest.fullName}</p>
                <p className="text-gray-600 text-sm mt-1">{selectedRequest.description}</p>
              </div>
              
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Écrivez votre réponse ici (proposition de devis, questions complémentaires, etc.)"
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none"
              />
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedRequest(null);
                    setResponseMessage("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={sendingResponse}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={sendingResponse}
                  className="px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] flex items-center"
                >
                  {sendingResponse ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    <FaPaperPlane className="mr-2" />
                  )}
                  Envoyer la réponse
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
              Mes Demandes Clients
            </h1>
            <p className="text-gray-600">
              Gérez toutes les demandes de services reçues de vos clients potentiels
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                <FaCheck className="text-3xl text-green-500" />
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
                <p className="text-gray-500">
                  Vous recevrez des demandes ici dès qu'un client vous contacte
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <div key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Informations du client */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center mb-2">
                              <FaUser className="text-gray-400 mr-2" />
                              <h3 className="text-lg font-semibold text-gray-900">
                                {request.fullName}
                              </h3>
                              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(request.status)}`}>
                                {getStatusIcon(request.status)}
                                {request.status === "pending" ? "En attente" : 
                                 request.status === "accepted" ? "Acceptée" : "Rejetée"}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <FaEnvelope className="mr-2" />
                                {request.email}
                              </div>
                              <div className="flex items-center">
                                <FaPhone className="mr-2" />
                                {request.phone}
                              </div>
                              {request.address && (
                                <div className="flex items-center">
                                  <FaMapMarkerAlt className="mr-2" />
                                  {request.address}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            <FaCalendar className="inline mr-1" />
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        
                        {/* Description de la demande */}
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <FaTools className="mr-2" />
                            Description du projet
                          </h4>
                          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                            {request.description}
                          </p>
                        </div>
                        
                        {/* Réponses existantes */}
                        {responses[request._id] && responses[request._id].length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <FaComment className="mr-2" />
                              Vos réponses
                            </h4>
                            <div className="space-y-2">
                              {responses[request._id].map((response, index) => (
                                <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                  <p className="text-gray-700">{response.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Envoyé le {formatDate(response.createdAt)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-3 lg:w-48">
                        {request.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request._id, "accepted")}
                              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                            >
                              <FaCheck className="mr-2" />
                              Accepter
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowResponseModal(true);
                              }}
                              className="w-full bg-[#003366] hover:bg-[#002244] text-white py-2 px-4 rounded-lg flex items-center justify-center"
                            >
                              <FaComment className="mr-2" />
                              Répondre
                            </button>
                            
                            <button
                              onClick={() => handleStatusUpdate(request._id, "rejected")}
                              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                            >
                              <FaTimes className="mr-2" />
                              Refuser
                            </button>
                          </>
                        )}
                        
                        {request.status === "accepted" && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowResponseModal(true);
                            }}
                            className="w-full bg-[#FF6B35] hover:bg-[#E55A2B] text-white py-2 px-4 rounded-lg flex items-center justify-center"
                          >
                            <FaComment className="mr-2" />
                            Envoyer une réponse
                          </button>
                        )}
                        
                        {request.status === "rejected" && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, "pending")}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg flex items-center justify-center"
                          >
                            <FaEye className="mr-2" />
                            Remettre en attente
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
            <h3 className="text-lg font-semibold text-[#003366] mb-2">
              Comment gérer les demandes ?
            </h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start">
                <FaCheck className="text-green-500 mr-2 mt-1" />
                <span><strong>Accepter :</strong> La demande est marquée comme acceptée et vous pouvez communiquer avec le client</span>
              </li>
              <li className="flex items-start">
                <FaComment className="text-blue-500 mr-2 mt-1" />
                <span><strong>Répondre :</strong> Envoyez un message au client (devis, questions, disponibilités)</span>
              </li>
              <li className="flex items-start">
                <FaTimes className="text-red-500 mr-2 mt-1" />
                <span><strong>Refuser :</strong> Déclinez la demande si elle ne correspond pas à vos services ou disponibilités</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtisanRequestsPage;