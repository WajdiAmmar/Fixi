// components/home/Header.jsx
import React, { useState } from "react";
import {
  Home,
  Wrench,
  MessageSquare,
  Phone,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import { getServices } from "../../services/serviceService";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [showServices, setShowServices] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  const handleAuthClick = () => {
    if (user && token) {
      dispatch(logout());
      navigate("/signin");
    } else {
      navigate("/signin");
    }
  };

  const loadServices = async () => {
    if (servicesLoaded) return;

    try {
      setLoadingServices(true);
      const data = await getServices();
      setServices(data);
      setServicesLoaded(true);
    } catch (error) {
      console.error("Erreur chargement services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/fixi_logo-removebg-preview.png"
              alt="Fixi Logo"
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative">
            <Link
              to="/home"
              className="flex items-center space-x-2 text-[#003366] hover:text-[#FF6B35]"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </Link>

            {/* SERVICES WITH DROPDOWN */}
            <div
              className="relative"
              onMouseEnter={() => {
                setShowServices(true);
                loadServices();
              }}
              onMouseLeave={() => setShowServices(false)}
            >
              <div className="flex items-center space-x-2 text-[#003366] hover:text-[#FF6B35] cursor-pointer">
                <Wrench className="w-4 h-4" />
                <span>Services</span>
              </div>

              {showServices && (
                <div className="absolute top-full left-0 pt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  {loadingServices ? (
                    <div className="p-4 text-sm text-gray-500">
                      Chargement...
                    </div>
                  ) : (
                    <ul className="py-2">
                      {services.map((service) => (
                        <li
                          key={service._id}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setShowServices(false);
                            navigate(`/services/${service._id}`);
                          }}
                        >
                          {service.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/client/requests"
              className="flex items-center space-x-2 text-[#003366] hover:text-[#FF6B35]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mes Demandes</span>
            </Link>

            <Link
              to="/contact"
              className="flex items-center space-x-2 text-[#003366] hover:text-[#FF6B35]"
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Rechercher</span>
            </button>

            <button
              onClick={handleAuthClick}
              className="flex items-center space-x-2 bg-[#FF6B35] hover:bg-[#E55A2B] text-white font-semibold py-2 px-6 rounded-full transition-all"
            >
              {user && token ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>Connexion</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
