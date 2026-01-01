const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-[#FF6B35]">
      <h3 className="text-xl font-bold">{service.name}</h3>
      <p className="text-gray-600">
        {service.subServices?.join(", ")}
      </p>
    </div>
  );
};

export default ServiceCard;
