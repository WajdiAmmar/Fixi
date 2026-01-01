// components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";


const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white text-[#003366] shadow-lg border-b border-gray-200 relative z-50">
      <div className="px-4 py-2 flex justify-between items-center">
        {/* Logo à gauche */}
        <div className="w-16 h-16 flex items-center space-x-3">
          <img
            src="/fixi_logo-removebg-preview.png"
            alt="Fixi Logo"
            className="w-full h-full object-contain"
          />
          <span className="text-xl font-bold">Admin Dashboard</span>
        </div>

        {/* Profil à droite avec dropdown */}
        <div className="flex items-center space-x-4" ref={dropdownRef}>
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 relative"
            onClick={toggleDropdown}
          >
            <FaUserCircle className="text-2xl text-[#003366]" />
            <span className="font-medium text-[#003366]">Admin</span>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                {/* Option Profil */}
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    // Rediriger vers la page profil (à implémenter)
                    // navigate("/profile");
                  }}
                >
                  <FaUser className="text-[#003366]" />
                  <span>Profil</span>
                </button>

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-1"></div>

                {/* Option Déconnexion */}
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;