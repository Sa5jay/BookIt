import React from 'react';

// Define the type for the component's props
type ExperienceCardProps = {
  imageUrl: string;
  title: string;
  location: string;
  description: string;
  price: number;
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  imageUrl,
  title,
  location,
  description,
  price,
}) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105">
      {/* Image */}
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            {location}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4">{description}</p>

        {/* Price and Details Button */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-red-600">
            From <span className="font-bold">₹{price}</span>
          </p>
          <button className="bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;