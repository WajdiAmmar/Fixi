// components/Sidebar.jsx
import React, { useState } from 'react';
import { 
  FaUsers, 
  FaCogs, 
  FaSlidersH,
  FaChevronLeft,
  FaChevronRight 
} from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'users', label: 'Utilisateurs', icon: FaUsers },
    { id: 'services', label: 'Services', icon: FaCogs },
    { id: 'settings', label: 'Paramètres', icon: FaSlidersH }
  ];

  return (
    <aside className={`bg-[#003366] text-white transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} h-screen flex flex-col`}>
      {/* En-tête sans logo */}
      <div className="p-3 border-b border-[#002244] flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-bold text-white">Menu Admin</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-[#002244] transition-colors duration-200"
        >
          {isCollapsed ? <FaChevronRight size={16} /> : <FaChevronLeft size={16} />}
        </button>
      </div>

      {/* Menu de navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-[#FF8C00] text-white shadow-lg'
                      : 'text-gray-200 hover:bg-[#002244] hover:text-white'
                  }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer du sidebar */}
      <div className="p-3 border-t border-[#002244]">
        {!isCollapsed && (
          <div className="text-center text-gray-300 text-xs">
            <p>Version 1.0</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;