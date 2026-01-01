import { useState } from "react";
import { useSelector } from "react-redux";
import { createArtisanProfile } from "../services/artisanProfileService";
import ProfileInfoStep from "../components/createProfilSteps/ProfileInfoStep";
import AddressStep from "../components/createProfilSteps/AddressStep";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateArtisanProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    artisan_type: "",
    serviceId: "",
    experience_years: 0,
    profile_name: "",
    profile_picture: null,
    profile_banner: null,
    experiences: [],
    address: {
      city: "",
      postal_code: "",
      full_address: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const handleNext = () => setCurrentStep(2);
  const handlePrevious = () => setCurrentStep(1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const formPayload = new FormData();

      // Champs texte
      formPayload.append("userId", user.id);
      formPayload.append("email", formData.email);
      formPayload.append("phone", formData.phone);
      formPayload.append("artisan_type", formData.artisan_type);
      formPayload.append("serviceId", formData.serviceId);
      formPayload.append("profile_name", formData.profile_name);
      formPayload.append("experience_years", formData.experience_years);
      formPayload.append(
        "professional_experiences",
        JSON.stringify(formData.experiences)
      );

      // Adresse
      formPayload.append("address[city]", formData.address.city);
      formPayload.append("address[postal_code]", formData.address.postal_code);
      formPayload.append(
        "address[full_address]",
        formData.address.full_address
      );

      // Fichiers
      if (formData.profile_picture) {
        formPayload.append("profile_picture", formData.profile_picture);
      }
      if (formData.profile_banner) {
        formPayload.append("profile_banner", formData.profile_banner);
      }

      const response = await createArtisanProfile(formPayload);
      const profileId = response._id;

      Swal.fire({
        title: "Profil créé 🎉",
        text: "Redirection vers votre profil...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate(`/artisan-profile/${profileId}`);
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la création du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  // Steps
  const steps = [
    { number: 1, title: "Informations du profil" },
    { number: 2, title: "Adresse" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#003366] mb-2">
            Créer votre profil artisan
          </h1>
          <p className="text-[#C0C0C0]">
            Complétez les informations pour créer votre profil professionnel
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number
                      ? "bg-[#003366] border-[#003366] text-white"
                      : "border-[#C0C0C0] text-[#C0C0C0]"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`ml-2 ${
                    currentStep >= step.number
                      ? "text-[#003366]"
                      : "text-[#C0C0C0]"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.number
                        ? "bg-[#003366]"
                        : "bg-[#C0C0C0]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg relative">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-t-lg">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <ProfileInfoStep
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <AddressStep
              formData={formData}
              setFormData={setFormData}
              onPrevious={handlePrevious}
              onSubmit={handleSubmit}
            />
          )}

          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <div className="text-[#003366]">
                Création du profil en cours...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateArtisanProfile;
