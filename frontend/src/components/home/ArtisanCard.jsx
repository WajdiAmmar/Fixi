import { Link } from "react-router-dom";

const ArtisanCard = ({ artisan }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <img
        src={artisan.profile_picture}
        alt={artisan.profile_name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold">{artisan.profile_name}</h3>
        <p className="text-[#FF6B35] font-semibold">{artisan.artisan_type}</p>
        <Link
          to={`/client/artisan/${artisan._id}`}
          className="mt-4 inline-block bg-[#003366] text-white px-4 py-2 rounded-full"
        >
          Consulter
        </Link>
      </div>
    </div>
  );
};

export default ArtisanCard;
