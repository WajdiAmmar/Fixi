import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import ArtisanCard from "../components/home/ArtisanCard";
import { getArtisanProfilesByServiceId } from "../services/artisanProfileService";

const ServiceArtisansPage = () => {
  const { serviceId } = useParams();

  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const data = await getArtisanProfilesByServiceId(serviceId);
        setArtisans(data);
      } catch (error) {
        console.error("Erreur chargement artisans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [serviceId]);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-10 min-h-[60vh]">
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : artisans.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucun artisan disponible pour ce service.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan._id} artisan={artisan} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ServiceArtisansPage;
