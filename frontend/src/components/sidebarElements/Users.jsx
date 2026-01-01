// components/Users.jsx
import React from 'react';
import { FaUsers, FaPlus, FaSearch } from 'react-icons/fa';

const Users = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003366] flex items-center space-x-3">
          <FaUsers className="text-[#FF8C00]" />
          <span>Gestion des Utilisateurs</span>
        </h1>
        <button className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors duration-200">
          <FaPlus />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-80">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte utilisateur exemple */}
          {[1, 2, 3, 4, 5, 6].map((user) => (
            <div key={user} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-[#003366] rounded-full flex items-center justify-center text-white font-bold">
                  U{user}
                </div>
                <div>
                  <h3 className="font-semibold text-[#003366]">Utilisateur {user}</h3>
                  <p className="text-gray-600 text-sm">user{user}@example.com</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 bg-[#003366] text-white py-2 rounded text-sm hover:bg-blue-800 transition-colors duration-200">
                  Modifier
                </button>
                <button className="flex-1 bg-[#C0C0C0] text-gray-700 py-2 rounded text-sm hover:bg-gray-400 transition-colors duration-200">
                  Désactiver
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;