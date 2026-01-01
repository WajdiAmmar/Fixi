import React, { useEffect, useState } from "react";
import Header from "../components/home/Header";
import ArtisanCard from "../components/home/ArtisanCard";
import ServiceCard from "../components/home/ServiceCard";
import Footer from "../components/home/Footer";
import { ArrowRight, Star, Users, Shield } from "lucide-react";
import { getRandomServices } from "../services/serviceService";
import { getRandomArtisanProfiles } from "../services/artisanProfileService";

const HomePage = () => {
  const [artisans, setArtisans] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [artisanData, serviceData] = await Promise.all([
          getRandomArtisanProfiles(),
          getRandomServices(),
        ]);

        setArtisans(artisanData);
        setServices(serviceData);
      } catch (error) {
        console.error("Erreur chargement home:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#004080]/80">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('/home-photo.png')` }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Trouvez l'artisan <span className="text-[#FF6B35]">parfait</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Des professionnels vérifiés près de chez vous.
            </p>
            <button className="flex items-center space-x-2 bg-[#FF6B35] text-white font-bold py-4 px-8 rounded-full">
              <span>Trouver un artisan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-10 h-10 mx-auto text-[#003366]" />
              <h3 className="text-xl font-bold">Qualité garantie</h3>
            </div>
            <div className="text-center p-6">
              <Star className="w-10 h-10 mx-auto text-[#FF6B35]" />
              <h3 className="text-xl font-bold">Avis vérifiés</h3>
            </div>
            <div className="text-center p-6">
              <Users className="w-10 h-10 mx-auto text-[#003366]" />
              <h3 className="text-xl font-bold">Large réseau</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">
            Services <span className="text-[#FF6B35]">populaires</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">
            Artisans <span className="text-[#FF6B35]">recommandés</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan._id} artisan={artisan} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
