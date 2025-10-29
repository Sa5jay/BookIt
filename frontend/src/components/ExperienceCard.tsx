import React from 'react';


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
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:scale-105 flex flex-col h-full">

      <img className="w-full h-40 sm:h-48 md:h-56 object-cover" src={imageUrl} alt={title} />

      <div className="p-4 flex-1 flex flex-col">
 
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            {location}
          </span>
        </div>


        <p className="text-gray-700 text-sm mb-4">{description}</p>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto">
          <p className="text-lg font-semibold text-red-600 mb-3 sm:mb-0">
            From <span className="font-bold">₹{price}</span>
          </p>
          <div className="w-full sm:w-auto bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded text-center">
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;