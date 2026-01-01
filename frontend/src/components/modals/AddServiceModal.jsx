import React from 'react';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';

const AddServiceModal = ({ 
  showModal, 
  closeModal, 
  newService, 
  setNewService, 
  currentSubService, 
  setCurrentSubService, 
  handleAddSubService, 
  handleRemoveSubService, 
  handleAddService 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* En-tête de la modal */}
        <div className="bg-[#003366] text-white p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">Nouveau Service</h2>
          <button
            onClick={closeModal}
            className="text-white hover:text-gray-200 transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Corps de la modal */}
        <div className="p-6 space-y-4">
          {/* Champ nom du service */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du service *
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              placeholder="Ex: Réparation électrique"
            />
          </div>

          {/* Section sous-services */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-services
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={currentSubService}
                onChange={(e) => setCurrentSubService(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
                placeholder="Nom du sous-service"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubService()}
              />
              <button
                onClick={handleAddSubService}
                className="bg-[#C0C0C0] text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-400 transition-colors duration-200 flex items-center space-x-1"
              >
                <FaPlus size={14} />
                <span>Ajouter</span>
              </button>
            </div>

            {/* Liste des sous-services ajoutés */}
            {newService.subServices.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Sous-services ajoutés ({newService.subServices.length})
                </h4>
                <ul className="space-y-1">
                  {newService.subServices.map((subService, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded">
                      <span className="text-sm text-gray-700">{subService}</span>
                      <button
                        onClick={() => handleRemoveSubService(index)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <FaTrash size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Pied de la modal */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={handleAddService}
            className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Ajouter le service</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;