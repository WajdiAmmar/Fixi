import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const DeleteServiceModal = ({ 
  showDeleteModal, 
  closeDeleteModal, 
  serviceToDelete, 
  handleDeleteService 
}) => {
  if (!showDeleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* En-tête de la modal */}
        <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaExclamationTriangle />
            <span>Supprimer le Service</span>
          </h2>
          <button
            onClick={closeDeleteModal}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Corps de la modal */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Êtes-vous sûr de vouloir supprimer le service <strong>"{serviceToDelete?.name}"</strong> ?
          </p>
          <p className="text-red-600 text-sm">
            Cette action est irréversible. Tous les sous-services associés seront également supprimés.
          </p>
        </div>

        {/* Pied de la modal */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleDeleteService}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <FaTimes />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteServiceModal;