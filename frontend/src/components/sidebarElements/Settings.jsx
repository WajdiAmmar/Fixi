// components/Settings.jsx
import React from 'react';
import { FaSlidersH } from 'react-icons/fa';

const Settings = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#003366] flex items-center space-x-3">
          <FaSlidersH className="text-[#FF8C00]" />
          <span>Paramètres</span>
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Interface des paramètres à développer...</p>
      </div>
    </div>
  );
};

export default Settings;