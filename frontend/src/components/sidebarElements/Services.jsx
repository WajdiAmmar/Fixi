import React, { useState, useEffect } from 'react';
import { FaCogs, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getServices, createService, updateService, deleteService } from '../../services/serviceService';
import AddServiceModal from '../../components/modals/AddServiceModal';
import EditServiceModal from '../../components/modals/EditServiceModal';
import DeleteServiceModal from '../../components/modals/DeleteServiceModal';

const Services = () => {
  const [services, setServices] = useState([]);
  
  // États pour la modal d'ajout
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    subServices: []
  });
  const [currentSubService, setCurrentSubService] = useState('');

  // États pour la modal de modification
  const [showEditModal, setShowEditModal] = useState(false);
  const [editService, setEditService] = useState({
    _id: '',
    name: '',
    subServices: []
  });
  const [currentEditSubService, setCurrentEditSubService] = useState('');

  // États pour la modal de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Charger les services au démarrage
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Erreur lors du chargement des services:", error);
    }
  };

  // === FONCTIONS POUR L'AJOUT ===
  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    setNewService({ name: '', subServices: [] });
    setCurrentSubService('');
  };

  const handleAddSubService = () => {
    if (!currentSubService.trim()) return;
    setNewService(prev => ({
      ...prev,
      subServices: [...prev.subServices, currentSubService.trim()]
    }));
    setCurrentSubService('');
  };

  const handleRemoveSubService = (index) => {
    setNewService(prev => ({
      ...prev,
      subServices: prev.subServices.filter((_, i) => i !== index)
    }));
  };

  const handleAddService = async () => {
    if (!newService.name.trim()) {
      alert("Veuillez saisir un nom pour le service");
      return;
    }

    try {
      const serviceData = {
        name: newService.name,
        subServices: newService.subServices
      };

      const created = await createService(serviceData);
      setServices([...services, created]);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la création du service:", error);
      alert("Erreur lors de la création du service");
    }
  };

  // === FONCTIONS POUR LA MODIFICATION ===
  const openEditModal = (service) => {
    setEditService({
      _id: service._id,
      name: service.name,
      subServices: service.subServices || []
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditService({ _id: '', name: '', subServices: [] });
    setCurrentEditSubService('');
  };

  const handleAddEditSubService = () => {
    if (!currentEditSubService.trim()) return;
    setEditService(prev => ({
      ...prev,
      subServices: [...prev.subServices, currentEditSubService.trim()]
    }));
    setCurrentEditSubService('');
  };

  const handleRemoveEditSubService = (index) => {
    setEditService(prev => ({
      ...prev,
      subServices: prev.subServices.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateService = async () => {
    if (!editService.name.trim()) {
      alert("Veuillez saisir un nom pour le service");
      return;
    }

    try {
      const serviceData = {
        name: editService.name,
        subServices: editService.subServices
      };

      const updated = await updateService(editService._id, serviceData);
      
      // Mettre à jour la liste des services
      setServices(services.map(service => 
        service._id === editService._id ? updated : service
      ));
      
      closeEditModal();
    } catch (error) {
      console.error("Erreur lors de la modification du service:", error);
      alert("Erreur lors de la modification du service");
    }
  };

  // === FONCTIONS POUR LA SUPPRESSION ===
  const openDeleteModal = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete._id);
      
      // Mettre à jour la liste des services
      setServices(services.filter(service => service._id !== serviceToDelete._id));
      
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression du service:", error);
      alert("Erreur lors de la suppression du service");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003366] flex items-center space-x-3">
          <FaCogs className="text-[#FF8C00]" />
          <span>Gestion des Services</span>
        </h1>
        <button
          onClick={openModal}
          className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors duration-200"
        >
          <FaPlus />
          <span>Nouveau Service</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {services.length === 0 ? (
          <p className="text-gray-600">Aucun service disponible...</p>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-[#003366]">
                    {service.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <FaEdit size={16} />
                      <span className="text-sm">Modifier</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(service)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <FaTrash size={16} />
                      <span className="text-sm">Supprimer</span>
                    </button>
                  </div>
                </div>
                
                {service.subServices && service.subServices.length > 0 && (
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-700 mb-2">Sous-services :</h4>
                    <ul className="space-y-1">
                      {service.subServices.map((subService, index) => (
                        <li key={index} className="text-gray-600 flex items-center space-x-2">
                          <span className="w-2 h-2 bg-[#FF8C00] rounded-full"></span>
                          <span>{subService}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddServiceModal
        showModal={showModal}
        closeModal={closeModal}
        newService={newService}
        setNewService={setNewService}
        currentSubService={currentSubService}
        setCurrentSubService={setCurrentSubService}
        handleAddSubService={handleAddSubService}
        handleRemoveSubService={handleRemoveSubService}
        handleAddService={handleAddService}
      />

      <EditServiceModal
        showEditModal={showEditModal}
        closeEditModal={closeEditModal}
        editService={editService}
        setEditService={setEditService}
        currentEditSubService={currentEditSubService}
        setCurrentEditSubService={setCurrentEditSubService}
        handleAddEditSubService={handleAddEditSubService}
        handleRemoveEditSubService={handleRemoveEditSubService}
        handleUpdateService={handleUpdateService}
      />

      <DeleteServiceModal
        showDeleteModal={showDeleteModal}
        closeDeleteModal={closeDeleteModal}
        serviceToDelete={serviceToDelete}
        handleDeleteService={handleDeleteService}
      />
    </div>
  );
};

export default Services;