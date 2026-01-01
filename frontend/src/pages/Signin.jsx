// pages/Signin.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signinUser } from "../redux/auth/authSlice";
import { checkUserArtisanProfile } from "../services/artisanProfileService";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [checkingProfile, setCheckingProfile] = useState(false);

  const handleUserRedirection = useCallback(
    async (userData) => {
      if (userData.role === "admin") {
        navigate("/admin");
        return;
      }

      if (userData.role === "artisan") {
        setCheckingProfile(true);
        try {
          console.log("userData", userData);
          const profileExists = await checkUserArtisanProfile(userData.id);
          if (profileExists.exists === true) {
            navigate(`/artisan-profile/${profileExists.profileId}`);
          } else {
            navigate("/create-profile");
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du profil:", error);
          navigate("/create-profile");
        } finally {
          setCheckingProfile(false);
        }
      } else {
        navigate("/home");
      }
    },
    [navigate]
  );

  useEffect(() => {
    if (user && token) {
      handleUserRedirection(user);
    }
  }, [user, token, handleUserRedirection]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(signinUser(formData));

    if (signinUser.fulfilled.match(resultAction)) {
      const userData = resultAction.payload.user;
      await handleUserRedirection(userData);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-2 rounded-full overflow-hidden border-4 border-[#FF8C00] shadow-lg">
            <img
              src="fixi_logo-removebg-preview.png"
              alt="Fixi Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#003366]">Fixi</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="absolute top-4 right-6 text-sm text-gray-600 hover:text-[#FF8C00] font-medium underline transition-colors"
        >
          Continuer en tant que visiteur
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-[#003366] py-4 px-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Connexion
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all duration-200"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all duration-200"
                placeholder="Votre mot de passe"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || checkingProfile}
              className="w-full bg-[#FF8C00] hover:bg-[#e67e00] text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-[#FF8C00] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || checkingProfile ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  {checkingProfile
                    ? "Vérification du profil..."
                    : "Connexion en cours..."}
                </div>
              ) : (
                "Se connecter"
              )}
            </button>

            {/* Signup Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Pas de compte ?{" "}
                <button
                  type="button"
                  onClick={goToSignup}
                  className="text-[#003366] hover:text-[#FF8C00] font-semibold transition-colors duration-200 underline"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;
