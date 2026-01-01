// components/ArtisanHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaUser, FaCog, FaClipboardList, FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/auth/authSlice";

const ArtisanHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
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

  const navigateToProfile = () => {
    navigate("/artisan/profile");
    setIsDropdownOpen(false);
  };

  const navigateToSettings = () => {
    navigate("/artisan/settings");
    setIsDropdownOpen(false);
  };

  const navigateToRequests = () => {
    navigate("/artisan/requests");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white text-[#003366] shadow-lg border-b border-gray-200 relative z-50">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Logo et navigation à gauche */}
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 flex items-center cursor-pointer">
            <img
              src="/fixi_logo-removebg-preview.png"
              alt="Fixi Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-[#003366]">Espace Artisan</span>
        </div>

        {/* Navigation principale et profil */}
        <div className="flex items-center space-x-6">
          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-6">            
            <button
              onClick={navigateToRequests}
              className="flex items-center space-x-2 text-[#003366] hover:text-[#FF6B35] font-medium transition-colors relative"
            >
              <FaClipboardList className="w-5 h-5" />
              <span>Mes demandes</span>
            </button>
          </nav>

          {/* Profil avec dropdown */}
          <div className="flex items-center space-x-4" ref={dropdownRef}>
            <div className="hidden md:block text-right">
              <p className="font-semibold text-[#003366]">{user?.firstName || "Artisan"} {user?.lastName || "Artisan"}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
            
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200 relative"
              onClick={toggleDropdown}
            >
              <FaUserCircle className="text-3xl text-[#003366]" />
              
              {/* Indicateur dropdown */}
              <div className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                <svg className="w-4 h-4 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50">
                  {/* En-tête du dropdown */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">{user?.name || "Artisan"}</p>
                    <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                  </div>

                  {/* Options rapides */}
                  <div className="py-2">
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-200 rounded-lg mx-2"
                      onClick={navigateToProfile}
                    >
                      <FaUser className="text-[#003366]" />
                      <div>
                        <span className="font-medium">Mon Profil</span>
                        <p className="text-xs text-gray-500">Gérer votre profil public</p>
                      </div>
                    </button>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-200 rounded-lg mx-2"
                      onClick={navigateToSettings}
                    >
                      <FaCog className="text-[#003366]" />
                      <div>
                        <span className="font-medium">Paramètres</span>
                        <p className="text-xs text-gray-500">Préférences et configuration</p>
                      </div>
                    </button>
                  </div>

                  {/* Séparateur */}
                  <div className="border-t border-gray-200 my-1"></div>

                  {/* Option Déconnexion */}
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg mx-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span className="font-medium">Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArtisanHeader;